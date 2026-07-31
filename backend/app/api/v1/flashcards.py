from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.all_models import User, Document, FlashcardDeck, Flashcard
from app.schemas.schemas import ApiResponse, FlashcardMasteryUpdate
from app.services.rag_stubs import ai_flashcard_generator

router = APIRouter(prefix="/flashcards", tags=["3D Spaced Repetition Flashcards"])

@router.get("", response_model=ApiResponse)
def list_flashcards(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    decks = db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id).all()
    cards_out = []
    
    for d in decks:
        cards = db.query(Flashcard).filter(Flashcard.deck_id == d.id).all()
        for c in cards:
            cards_out.append({
                "id": c.id,
                "deck": d.name,
                "question": c.question,
                "answer": c.answer,
                "difficulty": c.difficulty,
                "mastered": c.mastered,
                "doc": c.doc
            })

    return ApiResponse(success=True, data=cards_out)

@router.post("/generate", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def generate_flashcards(
    doc_id: Optional[str] = None,
    num_cards: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_title = "Computer Network Unit 1-5"
    doc_text = "Computer Networking Principles: Network Topology defines how computer systems and network devices are connected together. Main topologies include Bus, Star, Ring, Mesh, and Hybrid. Bus topology uses a single backbone cable where all devices connect. Star topology connects every device to a central Switch or Hub."

    if doc_id:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    else:
        doc = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).first()

    if doc and doc.extracted_text:
        doc_text = doc.extracted_text
        doc_title = doc.title

    generated_cards = ai_flashcard_generator.generate_flashcards(doc_text=doc_text, doc_title=doc_title, num_cards=num_cards)

    deck = db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id, FlashcardDeck.name == f"Deck: {doc_title}").first()
    if not deck:
        deck = FlashcardDeck(user_id=current_user.id, name=f"Deck: {doc_title}")
        db.add(deck)
        db.commit()
        db.refresh(deck)

    fc_models = []
    for gc in generated_cards:
        fc = Flashcard(
            deck_id=deck.id,
            question=gc["question"],
            answer=gc["answer"],
            difficulty=gc.get("difficulty", "Medium"),
            mastered=False,
            doc=doc_title
        )
        fc_models.append(fc)

    db.add_all(fc_models)
    db.commit()

    return ApiResponse(
        success=True,
        message="AI Flashcards generated successfully",
        data=[
            {
                "id": c.id,
                "deck": deck.name,
                "question": c.question,
                "answer": c.answer,
                "difficulty": c.difficulty,
                "mastered": c.mastered,
                "doc": c.doc
            }
            for c in fc_models
        ]
    )

@router.patch("/{card_id}/mastery", response_model=ApiResponse)
def update_card_mastery(
    card_id: str,
    update_in: FlashcardMasteryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise NotFoundException("Flashcard not found")

    card.mastered = update_in.mastered
    db.commit()

    return ApiResponse(success=True, message="Flashcard mastery updated", data={"id": card.id, "mastered": card.mastered})

