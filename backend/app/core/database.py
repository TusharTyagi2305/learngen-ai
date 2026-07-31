from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

db_url = settings.DATABASE_URL
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

try:
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    if not db_url.startswith("sqlite"):
        with engine.connect() as conn:
            pass
except Exception as e:
    print(f"[DB Notice] Postgres connection failed ({e}). Falling back to SQLite sqlite:///./learngen_ai.db")
    db_url = "sqlite:///./learngen_ai.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
