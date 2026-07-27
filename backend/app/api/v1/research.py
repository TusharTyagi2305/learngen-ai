from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User, ResearchRecord
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/research", tags=["Research Assistant Foundation"])

@router.get("", response_model=ApiResponse)
def list_research_records(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(ResearchRecord).filter(ResearchRecord.user_id == current_user.id).all()
    out = [
        {
            "id": r.id,
            "title": r.title,
            "file_name": r.file_name,
            "summary": r.summary,
            "keywords": r.keywords or [],
            "gap_analysis": r.gap_analysis
        }
        for r in records
    ]
    return ApiResponse(success=True, data=out)
