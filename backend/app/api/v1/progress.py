from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/progress", tags=["Progress & Analytics"])

@router.get("/weekly", response_model=ApiResponse)
def get_weekly_progress(current_user: User = Depends(get_current_user)):
    chart_data = [
        {"day": "Mon", "hours": 4.2, "queries": 18},
        {"day": "Tue", "hours": 5.5, "queries": 24},
        {"day": "Wed", "hours": 3.8, "queries": 15},
        {"day": "Thu", "hours": 6.1, "queries": 32},
        {"day": "Fri", "hours": 4.5, "queries": 20},
        {"day": "Sat", "hours": 5.0, "queries": 28},
        {"day": "Sun", "hours": 4.1, "queries": 19}
    ]
    return ApiResponse(success=True, data=chart_data)

@router.get("/summary", response_model=ApiResponse)
def get_progress_summary(current_user: User = Depends(get_current_user)):
    return ApiResponse(
        success=True,
        data={
            "total_study_hours": 33.2,
            "mastery_score": "88%",
            "streak_days": 5,
            "completed_quizzes": 12,
            "flashcards_mastered": 42
        }
    )
