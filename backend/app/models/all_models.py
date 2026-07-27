import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False) # 'student', 'teacher', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    flashcard_decks = relationship("FlashcardDeck", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(Text, nullable=False)
    is_revoked = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="refresh_tokens")

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme = Column(String(20), default="dark")
    notifications_enabled = Column(Boolean, default=True)
    default_role = Column(String(50), default="student")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False) # PDF, DOCX, PPTX, TXT
    file_size = Column(String(50), nullable=False)
    pages = Column(Integer, default=1)
    chunks_count = Column(Integer, default=0)
    status = Column(String(50), default="ready") # uploaded, processing, ready, failed
    summary = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    vector_collection = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="documents")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="New RAG Study Chat")
    active_doc_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False) # 'user' or 'ai'
    text = Column(Text, nullable=False)
    citations = Column(JSON, nullable=True) # List of grounding citations
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("ChatSession", back_populates="messages")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    doc_title = Column(String(255), default="Document Vault")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    quiz_id = Column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False) # List of 4 string options
    correct_option = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="flashcard_decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    deck_id = Column(String(36), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Medium")
    mastered = Column(Boolean, default=False)
    doc = Column(String(255), default="Document Vault")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    deck = relationship("FlashcardDeck", back_populates="cards")

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    exam_date = Column(String(50), nullable=True)
    target_hours = Column(Float, default=10.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="study_plans")
    tasks = relationship("StudyPlanTask", back_populates="plan", cascade="all, delete-orphan")

class StudyPlanTask(Base):
    __tablename__ = "study_plan_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    plan_id = Column(String(36), ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    duration_mins = Column(Integer, default=45)
    priority = Column(String(20), default="Medium") # High, Medium, Low
    completed = Column(Boolean, default=False)

    plan = relationship("StudyPlan", back_populates="tasks")

class ResearchRecord(Base):
    __tablename__ = "research_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)
    gap_analysis = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")

class AdminConfig(Base):
    __tablename__ = "admin_config"

    id = Column(String(36), primary_key=True, default="global-config")
    chunk_size = Column(Integer, default=512)
    overlap = Column(Integer, default=50)
    top_k = Column(Integer, default=3)
    temperature = Column(Float, default=0.2)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
