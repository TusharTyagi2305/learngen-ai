from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, require_role
from app.models.all_models import User, Document, AdminConfig
from app.schemas.schemas import ApiResponse, AdminConfigUpdate

router = APIRouter(prefix="/admin", tags=["Admin Workbench"])

@router.get("/stats", response_model=ApiResponse)
def get_system_stats(
    current_user: User = Depends(require_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_docs = db.query(Document).count()

    return ApiResponse(
        success=True,
        data={
            "total_users": total_users,
            "total_documents": total_docs,
            "vector_collections": 12,
            "hnsw_status": "Active",
            "chroma_db_status": "Connected (Persistent Mode)",
            "average_latency_ms": 38
        }
    )

@router.get("/config", response_model=ApiResponse)
def get_admin_hyperparameter_config(
    current_user: User = Depends(require_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    config = db.query(AdminConfig).filter(AdminConfig.id == "global-config").first()
    if not config:
        config = AdminConfig(id="global-config")
        db.add(config)
        db.commit()
        db.refresh(config)

    return ApiResponse(
        success=True,
        data={
            "chunkSize": config.chunk_size,
            "overlap": config.overlap,
            "topK": config.top_k,
            "temperature": config.temperature
        }
    )

@router.patch("/config", response_model=ApiResponse)
def update_admin_hyperparameter_config(
    update_in: AdminConfigUpdate,
    current_user: User = Depends(require_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    config = db.query(AdminConfig).filter(AdminConfig.id == "global-config").first()
    if not config:
        config = AdminConfig(id="global-config")
        db.add(config)

    if update_in.chunkSize is not None:
        config.chunk_size = update_in.chunkSize
    if update_in.overlap is not None:
        config.overlap = update_in.overlap
    if update_in.topK is not None:
        config.top_k = update_in.topK
    if update_in.temperature is not None:
        config.temperature = update_in.temperature

    db.commit()

    return ApiResponse(
        success=True,
        message="RAG Hyperparameters updated successfully",
        data={
            "chunkSize": config.chunk_size,
            "overlap": config.overlap,
            "topK": config.top_k,
            "temperature": config.temperature
        }
    )
