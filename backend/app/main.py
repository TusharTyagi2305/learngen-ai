from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.all_models import User, Document, Quiz, QuizQuestion, FlashcardDeck, Flashcard, StudyPlan, StudyPlanTask, UserSettings, AdminConfig

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

def seed_initial_data():
    db = SessionLocal()
    try:
        # Seed Default Admin & Student Accounts
        admin = db.query(User).filter(User.email == "tushar@learngen.ai").first()
        if not admin:
            admin = User(
                email="tushar@learngen.ai",
                full_name="Tushar Tyagi",
                password_hash=get_password_hash("Password123!"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            db.add(UserSettings(user_id=admin.id, default_role="admin"))

            # Seed Sample Indexed Documents
            doc1 = Document(
                user_id=admin.id,
                title="Quantum_Computing_Principles_Ch3.pdf",
                stored_filename="seed_quantum.pdf",
                file_type="PDF",
                file_size="4.2 MB",
                pages=42,
                chunks_count=128,
                status="ready",
                vector_collection="physics_quantum_v1",
                summary="Comprehensive guide to quantum qubits, superposition, entanglement, and Shor's algorithm."
            )
            doc2 = Document(
                user_id=admin.id,
                title="Deep_Learning_Architectures_Summary.docx",
                stored_filename="seed_dl.docx",
                file_type="DOCX",
                file_size="2.8 MB",
                pages=26,
                chunks_count=84,
                status="ready",
                vector_collection="ai_deep_learning_v2",
                summary="Covers Transformers, Multi-Head Attention mechanisms, residual connections, and positional encodings."
            )
            db.add_all([doc1, doc2])
            db.commit()

            # Seed Flashcards & Quizzes
            deck = FlashcardDeck(user_id=admin.id, name="Quantum & AI Core")
            db.add(deck)
            db.commit()
            db.refresh(deck)

            fc1 = Flashcard(
                deck_id=deck.id,
                question="What is Quantum Superposition?",
                answer="The ability of a qubit to exist in linear combinations of |0⟩ and |1⟩ states simultaneously until measured.",
                difficulty="Medium",
                mastered=False,
                doc="Quantum_Computing_Principles_Ch3.pdf"
            )
            db.add(fc1)

            quiz = Quiz(user_id=admin.id, title="Transformer Architectures & Attention", doc_title="Deep_Learning_Architectures_Summary.docx")
            db.add(quiz)
            db.commit()
            db.refresh(quiz)

            q1 = QuizQuestion(
                quiz_id=quiz.id,
                question="Which operation computes scaled dot-product attention weights in Transformer models?",
                options=[
                    "softmax( (Q K^T) / sqrt(d_k) ) V",
                    "sigmoid( Q * K ) / d_k",
                    "tanh( Q + K ) * V",
                    "relu( Q K^T ) / sqrt(V)"
                ],
                correct_option=0,
                explanation="As stated on page 8 of Deep_Learning_Architectures_Summary.docx, dot-product attention scales by 1/sqrt(d_k) before applying Softmax."
            )
            db.add(q1)

            # Seed Admin Global Config
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
