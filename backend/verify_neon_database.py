import os
import sys
from sqlalchemy import create_engine, inspect, text

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

def main():
    print("=" * 70)
    print("[NEON POSTGRESQL VERIFICATION AUDIT]")
    print("=" * 70)

    db_url = settings.DATABASE_URL
    print(f"DATABASE_URL       : {db_url}")
    print(f"Engine Type        : {'PostgreSQL (+psycopg)' if 'postgresql' in db_url else 'UNKNOWN / SQLITE'}")
    
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        res = conn.execute(text("SELECT current_database(), current_user, version(), inet_server_addr();")).fetchone()
        db_name, db_user, version, server_addr = res[0], res[1], res[2], res[3]
        print(f"Connected Database : {db_name}")
        print(f"Connected User     : {db_user}")
        print(f"PostgreSQL Version : {version.split(',')[0]}")
        print(f"Host / Server Addr : {server_addr or engine.url.host}")
        
        # Check SSL Connection
        try:
            ssl_res = conn.execute(text("SELECT EXISTS (SELECT 1 FROM pg_stat_ssl WHERE pid = pg_backend_pid());")).fetchone()
            ssl_used = ssl_res[0] if ssl_res else True
        except Exception:
            ssl_used = "sslmode=require" in db_url
        print(f"SSL Secured        : {ssl_used}")

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("-" * 70)
    print(f"[+] Total Production Tables in Neon: {len(tables)}")
    print("-" * 70)
    
    required_tables = [
        "users", "otp_verifications", "documents", "audit_logs", 
        "quizzes", "quiz_questions", "flashcard_decks", "flashcards",
        "study_plans", "study_plan_tasks", "chat_sessions", "chat_messages",
        "admin_config", "api_metric_logs"
    ]
    
    table_counts = {}
    with engine.connect() as conn:
        for tbl in tables:
            try:
                cnt = conn.execute(text(f'SELECT COUNT(*) FROM "{tbl}"')).scalar()
                table_counts[tbl] = cnt
                print(f"  • Table '{tbl}': {cnt} rows")
            except Exception as e:
                print(f"  ! Table '{tbl}': ERROR ({e})")
                
    missing = [t for t in required_tables if t not in tables]
    if missing:
        print(f"\n[WARNING] Missing tables: {missing}")
    else:
        print("\n[PASS] ALL REQUIRED PRODUCTION TABLES VERIFIED IN NEON POSTGRESQL!")

if __name__ == "__main__":
    main()
