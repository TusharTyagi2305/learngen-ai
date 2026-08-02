from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.all_models import (
    User, Document, Quiz, QuizQuestion, FlashcardDeck, Flashcard, 
    StudyPlan, StudyPlanTask, UserSettings, AdminConfig, OTPVerification
)

# Import API Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.documents import router as documents_router
from app.api.v1.chats import router as chats_router
from app.api.v1.quizzes import router as quizzes_router
from app.api.v1.flashcards import router as flashcards_router
from app.api.v1.study_plans import router as study_plans_router
from app.api.v1.progress import router as progress_router
from app.api.v1.research import router as research_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Production Full-Stack RAG 2.0 AI Learning Platform API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Latency & Metrics Tracking Middleware
import time
from app.models.all_models import ApiMetricLog

@app.middleware("http")
async def log_api_metrics(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time_ms = round((time.time() - start_time) * 1000, 2)
    
    # Exclude static files / favicon from cluttering metrics
    if not request.url.path.endswith((".ico", ".png", ".jpg", ".css", ".js")):
        db = SessionLocal()
        try:
            metric = ApiMetricLog(
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                response_time_ms=process_time_ms
            )
            db.add(metric)
            db.commit()
        except Exception:
            pass
        finally:
            db.close()
            
    response.headers["X-Process-Time-MS"] = str(process_time_ms)
    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "detail": str(exc)
        }
    )

# Register Versioned V1 API Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(documents_router, prefix=settings.API_V1_PREFIX)
app.include_router(chats_router, prefix=settings.API_V1_PREFIX)
app.include_router(quizzes_router, prefix=settings.API_V1_PREFIX)
app.include_router(flashcards_router, prefix=settings.API_V1_PREFIX)
app.include_router(study_plans_router, prefix=settings.API_V1_PREFIX)
app.include_router(progress_router, prefix=settings.API_V1_PREFIX)
app.include_router(research_router, prefix=settings.API_V1_PREFIX)
app.include_router(notifications_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
def on_startup():
    # Initialize DB Tables
    Base.metadata.create_all(bind=engine)
    seed_initial_data()

from sqlalchemy import text

def seed_initial_data():
    db = SessionLocal()
    try:
        # Auto-migrate DB schema for newly added RBAC columns if missing
        if engine.dialect.name == "sqlite":
            migrations = [
                "ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN DEFAULT 0",
                "ALTER TABLE users ADD COLUMN permissions JSON",
                "ALTER TABLE users ADD COLUMN created_by VARCHAR(36)",
                "ALTER TABLE users ADD COLUMN updated_by VARCHAR(36)",
                "ALTER TABLE audit_logs ADD COLUMN action VARCHAR(100)",
                "ALTER TABLE audit_logs ADD COLUMN ip_address VARCHAR(45)"
            ]
        else:
            migrations = [
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE",
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSON",
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(36)",
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_by VARCHAR(36)",
                "ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(100)",
                "ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)"
            ]
        for m in migrations:
            try:
                db.execute(text(m))
                db.commit()
            except Exception:
                db.rollback()

        # Migrate any legacy Teacher records to Student role (2-role architecture)
        try:
            db.execute(text("UPDATE users SET role = 'student' WHERE role = 'teacher'"))
            db.commit()
        except Exception:
            db.rollback()

        admin_email = settings.DEFAULT_ADMIN_EMAIL.lower().strip()
        admin_pass = settings.DEFAULT_ADMIN_PASSWORD

        # Seed Default Super Admin Account from env
        super_admin = db.query(User).filter(User.email == admin_email).first()
        if not super_admin:
            super_admin = User(
                email=admin_email,
                full_name="Super Admin",
                password_hash=get_password_hash(admin_pass),
                role="super_admin",
                is_super_admin=True,
                is_active=True,
                permissions=["*"]
            )
            db.add(super_admin)
            db.commit()
            db.refresh(super_admin)

            db.add(UserSettings(user_id=super_admin.id, default_role="super_admin"))
            print(f"[RBAC Security] Super Admin created successfully: {admin_email}")
        else:
            updated = False
            if super_admin.role not in ["super_admin", "admin"]:
                super_admin.role = "super_admin"
                updated = True
            if not super_admin.is_super_admin:
                super_admin.is_super_admin = True
                updated = True
            if not super_admin.is_active:
                super_admin.is_active = True
                updated = True
            if updated:
                db.commit()

        # Seed Admin Global Config if missing
        config = db.query(AdminConfig).filter(AdminConfig.id == "global-config").first()
        if not config:
            config = AdminConfig(id="global-config", chunk_size=512, overlap=50, top_k=3, temperature=0.2)
            db.add(config)
            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "swagger": "/docs",
        "version": "2.0.0"
    }
