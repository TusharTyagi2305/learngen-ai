from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User, Quiz, QuizQuestion, QuizAttempt
from app.schemas.schemas import ApiResponse, QuizSubmitRequest

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

@router.post("/{quiz_id}/submit", response_model=ApiResponse)
def submit_quiz_attempt(
    quiz_id: str,
    submit_in: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    if not questions:
        # Default scoring
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
