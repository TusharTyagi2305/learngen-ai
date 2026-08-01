"""
LearnGen AI — SQLite to PostgreSQL Relational Data Migration Utility
Migrates all relational records (Users, Refresh Tokens, Settings, Documents, Chats,
Messages, Quizzes, Quiz Questions, Flashcard Decks, Flashcards, Study Plans, Tasks)
from SQLite to a target PostgreSQL database specified by DATABASE_URL.
"""

import os
import sys
import sqlite3
from sqlalchemy import create_engine, MetaData, Table, inspect
from sqlalchemy.orm import sessionmaker

os.environ["PYTHONIOENCODING"] = "utf-8"
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.config import settings
from app.core.database import Base
import app.models.all_models  # noqa

def run_migration(sqlite_path: str = "learngen_ai_backup.db", target_url: str = None):
    if target_url is None:
        target_url = settings.DATABASE_URL

    print("=" * 70)
    print(f"[MIGRATION ENGINE] Starting Data Migration")
    print(f" Source SQLite DB : '{sqlite_path}'")
    print(f" Target DB Engine : '{target_url.split('@')[-1] if '@' in target_url else target_url}'")
    print("=" * 70)

    if not os.path.exists(sqlite_path):
        print(f"[!] SQLite source database '{sqlite_path}' not found. Migration skipped.")
        return False

    if "sqlite" in target_url:
        print("[!] Target database URL is set to SQLite. Change DATABASE_URL to PostgreSQL to execute live migration.")
        print("    Example: postgresql+psycopg://postgres:postgres@localhost:5432/learngen_ai")
        return False

    # Connect to target PostgreSQL database
    pg_engine = create_engine(target_url)
    try:
        pg_conn = pg_engine.connect()
        pg_conn.close()
        print("[+] PostgreSQL Target Database Connection Verified!")
    except Exception as e:
        print(f"[ERROR] Cannot connect to PostgreSQL at '{target_url}': {e}")
        return False

    # Ensure PostgreSQL schema is created
    Base.metadata.create_all(bind=pg_engine)

    # Open SQLite connection
    sq_conn = sqlite3.connect(sqlite_path)
    sq_conn.row_factory = sqlite3.Row
    sq_cursor = sq_conn.cursor()

    pg_metadata = MetaData()
    pg_metadata.reflect(bind=pg_engine)

    table_order = [
        "users",
        "admin_config",
        "refresh_tokens",
        "user_settings",
        "documents",
        "chat_sessions",
        "chat_messages",
        "quizzes",
        "quiz_questions",
        "quiz_attempts",
        "flashcard_decks",
        "flashcards",
        "study_plans",
        "study_plan_tasks",
        "research_records",
        "notifications"
    ]

    total_migrated = 0

    with pg_engine.begin() as pg_transaction_conn:
        for t_name in table_order:
            if t_name not in pg_metadata.tables:
                continue

            sq_cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{t_name}';")
            if not sq_cursor.fetchone():
                continue

            rows = sq_cursor.execute(f"SELECT * FROM \"{t_name}\"").fetchall()
            if not rows:
                continue

            target_table = pg_metadata.tables[t_name]
            insert_dicts = []
            for row in rows:
                r_dict = dict(row)
                if t_name == "users":
                    if r_dict.get("is_super_admin") is None:
                        r_dict["is_super_admin"] = False
                    if r_dict.get("is_active") is None:
                        r_dict["is_active"] = True
                insert_dicts.append(r_dict)

            pg_transaction_conn.execute(target_table.insert(), insert_dicts)
            print(f"  [+] Migrated {len(insert_dicts)} records into PostgreSQL table '{t_name}'")
            total_migrated += len(insert_dicts)

    sq_conn.close()
    print("=" * 70)
    print(f"[SUCCESS] Migration Completed Successfully! Total records transferred: {total_migrated}")
    print("=" * 70)
    return True

if __name__ == "__main__":
    run_migration()
