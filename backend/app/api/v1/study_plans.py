from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.all_models import User, StudyPlan, StudyPlanTask
from app.schemas.schemas import ApiResponse, StudyTaskCreate

router = APIRouter(prefix="/study-plans", tags=["Adaptive Study Planner"])

@router.get("", response_model=ApiResponse)
def list_study_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).all()
    out = []
    for p in plans:
        tasks = db.query(StudyPlanTask).filter(StudyPlanTask.plan_id == p.id).all()
        t_out = [
            {
                "id": t.id,
                "title": t.title,
                "duration_mins": t.duration_mins,
                "priority": t.priority,
                "completed": t.completed
            }
            for t in tasks
        ]
        out.append({
            "id": p.id,
            "name": p.name,
            "exam_date": p.exam_date,
            "tasks": t_out
        })
    return ApiResponse(success=True, data=out)

@router.post("/{plan_id}/tasks", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def add_study_task(
    plan_id: str,
    task_in: StudyTaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_task = StudyPlanTask(
        plan_id=plan_id,
        title=task_in.title,
        duration_mins=task_in.duration_mins,
        priority=task_in.priority
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return ApiResponse(success=True, message="Task added to study plan", data={"id": new_task.id, "title": new_task.title})
