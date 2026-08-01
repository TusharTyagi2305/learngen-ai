from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    raise ValueError("SQLite is disabled in production. DATABASE_URL must point to PostgreSQL.")

engine = create_engine(db_url, pool_pre_ping=True)

# Verify live PostgreSQL connection on module load
with engine.connect() as conn:
    print(f"[DB Status] Connected to PostgreSQL Database: {engine.url.host}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
