from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User, Document, Quiz, Flashcard, UserSettings
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/users", tags=["User Profile & Settings"])

@router.get("/profile", response_model=ApiResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return ApiResponse(
        success=True,
        data={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat()
        }
    )

@router.get("/dashboard", response_model=ApiResponse)
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc_count = db.query(Document).filter(Document.user_id == current_user.id).count()
    quiz_count = db.query(Quiz).filter(Quiz.user_id == current_user.id).count()
    
    return ApiResponse(
        success=True,
        data={
            "user_name": current_user.full_name,
            "role": current_user.role,
            "total_documents": doc_count,
            "total_quizzes": quiz_count,
            "active_streak_days": 5,
            "hours_studied_this_week": 33.2
        }
    )

@router.get("/settings", response_model=ApiResponse)
def get_user_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return ApiResponse(
        success=True,
        data={
            "theme": settings.theme,
            "notifications_enabled": settings.notifications_enabled,
            "default_role": settings.default_role
        }
    )
