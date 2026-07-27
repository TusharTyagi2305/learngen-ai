from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.all_models import User, ChatSession, ChatMessage, Document
from app.schemas.schemas import ApiResponse, ChatMessageCreate
from app.services.rag_stubs import rag_service

router = APIRouter(prefix="/chats", tags=["AI RAG Chat Studio"])

@router.get("", response_model=ApiResponse)
def list_chat_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.created_at.desc()).all()
    out = [
        {
            "id": s.id,
            "title": s.title,
            "active_doc_id": s.active_doc_id,
            "created_at": s.created_at.isoformat()
        }
        for s in sessions
    ]
    return ApiResponse(success=True, data=out)

@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_chat_session(title: str = "New RAG Study Chat", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_session = ChatSession(user_id=current_user.id, title=title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # Initial AI welcome message
    welcome_msg = ChatMessage(
        session_id=new_session.id,
        sender="ai",
        text="Hello Tushar! I'm your LearnGen AI RAG Study Assistant. I answer questions strictly using your uploaded document vault. What would you like to explore today?",
        citations=[]
    )
    db.add(welcome_msg)
    db.commit()

    return ApiResponse(success=True, data={"id": new_session.id, "title": new_session.title})

@router.get("/{session_id}/messages", response_model=ApiResponse)
def get_chat_history(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise NotFoundException("Chat session not found")

    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    out = [
        {
            "id": m.id,
            "sender": m.sender,
            "text": m.text,
            "citations": m.citations or [],
            "timestamp": m.created_at.strftime("%I:%M %p")
        }
        for m in messages
    ]
    return ApiResponse(success=True, data=out)

@router.post("/{session_id}/messages", response_model=ApiResponse)
def send_chat_message(
    session_id: str,
    msg_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise NotFoundException("Chat session not found")

    # Save User message
    user_msg = ChatMessage(
        session_id=session.id,
        sender="user",
        text=msg_in.text,
        citations=[]
    )
    db.add(user_msg)
    db.commit()

    # Query RAG Service Engine
    rag_result = rag_service.query(user_query=msg_in.text, doc_id=msg_in.doc_id)

    # Save AI message
    ai_msg = ChatMessage(
        session_id=session.id,
        sender="ai",
        text=rag_result["answer"],
        citations=rag_result["citations"]
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ApiResponse(
        success=True,
        data={
            "id": ai_msg.id,
            "sender": "ai",
            "text": ai_msg.text,
            "citations": ai_msg.citations,
            "timestamp": ai_msg.created_at.strftime("%I:%M %p"),
            "ragMetrics": {
                "vectorSearchTimeMs": rag_result["vectorSearchTimeMs"],
                "llmLatencyMs": rag_result["llmLatencyMs"],
                "groundedRatio": rag_result["groundedRatio"]
            }
        }
    )
