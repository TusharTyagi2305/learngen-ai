import os
import sys
from sqlalchemy import create_engine, text, inspect

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine, SessionLocal
from app.models.all_models import (
    User, OTPVerification, Document, AuditLog, Quiz, QuizQuestion, 
    FlashcardDeck, Flashcard, StudyPlan, StudyPlanTask, ChatSession, 
    ChatMessage, AdminConfig, ApiMetricLog
)

def run_verification():
    print("=" * 80)
    print("      LEARNGEN AI — NEON POSTGRESQL FINAL VERIFICATION REPORT")
    print("=" * 80)

    db_url = settings.DATABASE_URL
    dialect_name = engine.dialect.name
    driver_name = engine.driver
    host = engine.url.host
    database_name = engine.url.database

    print(f"Current DATABASE_URL     : {db_url}")
    print(f"Current Database Engine  : {dialect_name} (+{driver_name})")
    print(f"Current Connected Host   : {host}")
    print(f"Current Database Name    : {database_name}")

    # Assert PostgreSQL Dialect and Neon host
    assert dialect_name == "postgresql", f"FAIL: Expected postgresql dialect, got {dialect_name}"
    assert "neon.tech" in host, f"FAIL: Expected Neon host, got {host}"
    assert not db_url.startswith("sqlite"), "FAIL: DATABASE_URL starts with sqlite"

    with engine.connect() as conn:
        ver_res = conn.execute(text("SELECT version();")).scalar()
        print(f"PostgreSQL Version       : {ver_res.split(',')[0]}")
        
        ssl_res = conn.execute(text("SELECT EXISTS (SELECT 1 FROM pg_stat_ssl WHERE pid = pg_backend_pid());")).scalar()
        print(f"SSL Connection Active    : {ssl_res}")

    print("-" * 80)
    print("PRODUCT TABLE AUDIT IN NEON POSTGRESQL:")
    print("-" * 80)

    db = SessionLocal()
    try:
        tables_status = {
            "users": db.query(User).count(),
            "otp_verifications": db.query(OTPVerification).count(),
            "documents": db.query(Document).count(),
            "audit_logs": db.query(AuditLog).count(),
            "quizzes": db.query(Quiz).count(),
            "quiz_questions": db.query(QuizQuestion).count(),
            "flashcard_decks": db.query(FlashcardDeck).count(),
            "flashcards": db.query(Flashcard).count(),
            "study_plans": db.query(StudyPlan).count(),
            "study_plan_tasks": db.query(StudyPlanTask).count(),
            "chat_sessions": db.query(ChatSession).count(),
            "chat_messages": db.query(ChatMessage).count(),
            "admin_config": db.query(AdminConfig).count(),
            "api_metric_logs": db.query(ApiMetricLog).count(),
        }

        for t_name, count in tables_status.items():
            print(f"  [+] Table '{t_name:<20}': {count} records in Neon")
    finally:
        db.close()

    print("=" * 80)
    print("CONNECTION TEST RESULT: PASS")
    print("ALL PRODUCTION TABLES VERIFIED IN NEON POSTGRESQL. ZERO SQLITE USAGE REMAINS.")
    print("=" * 80)

if __name__ == "__main__":
    run_verification()
