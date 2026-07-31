from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User, Document, Quiz, QuizQuestion, QuizAttempt
from app.schemas.schemas import ApiResponse, QuizSubmitRequest
from app.services.rag_stubs import ai_quiz_generator

router = APIRouter(prefix="/quizzes", tags=["AI Quiz Engine"])

@router.get("", response_model=ApiResponse)
def list_quizzes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()
    
    out = []
    for q in quizzes:
        questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == q.id).all()
        q_list = [
            {
                "id": qn.id,
                "question": qn.question,
                "options": qn.options,
                "correctOption": qn.correct_option,
                "explanation": qn.explanation
            }
            for qn in questions
        ]
        out.append({
            "id": q.id,
            "title": q.title,
            "doc": q.doc_title,
            "questions": q_list
        })

    return ApiResponse(success=True, data=out)

@router.post("/generate", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def generate_quiz(
    doc_id: Optional[str] = None,
    num_questions: int = 10,
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

    generated_questions = ai_quiz_generator.generate_quiz(doc_text=doc_text, doc_title=doc_title, num_questions=num_questions)

    new_quiz = Quiz(
        user_id=current_user.id,
        title=f"Quiz: {doc_title}",
        doc_title=doc_title
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    q_models = []
    for gq in generated_questions:
        q_obj = QuizQuestion(
            quiz_id=new_quiz.id,
            question=gq["question"],
            options=gq["options"],
            correct_option=gq.get("correct_option", 0),
            explanation=gq.get("explanation", "")
        )
        q_models.append(q_obj)

    db.add_all(q_models)
    db.commit()

    return ApiResponse(
        success=True,
        message="AI Quiz generated successfully from document context",
        data={
            "id": new_quiz.id,
            "title": new_quiz.title,
            "doc": new_quiz.doc_title,
            "questions": [
                {
                    "id": q.id,
                    "question": q.question,
                    "options": q.options,
                    "correctOption": q.correct_option,
                    "explanation": q.explanation
                }
                for q in q_models
            ]
        }
    )

@router.post("/{quiz_id}/submit", response_model=ApiResponse)
def submit_quiz_attempt(
    quiz_id: str,
    submit_in: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    if not questions:
        return ApiResponse(success=True, data={"score": 1, "total": 1, "percentage": 100.0})

    correct_count = 0
    for qn in questions:
        user_answer = submit_in.answers.get(qn.id)
        if user_answer is not None and user_answer == qn.correct_option:
            correct_count += 1

    total = len(questions)
    percentage = round((correct_count / total) * 100, 1) if total > 0 else 0.0

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=correct_count,
        total_questions=total
    )
    db.add(attempt)
    db.commit()

    return ApiResponse(
        success=True,
        message="Quiz attempt recorded",
        data={
            "quiz_id": quiz_id,
            "score": correct_count,
            "total": total,
            "percentage": percentage
        }
    )

