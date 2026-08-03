import os
from typing import List, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_NAME: str = "LearnGen AI Backend"
    API_V1_PREFIX: str = "/api/v1"
    
    SECRET_KEY: str = "learngen-ai-production-super-secret-jwt-key-2026-xyz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Default Super Admin Initialization Settings
    DEFAULT_ADMIN_EMAIL: str = "admin@learngen.ai"
    DEFAULT_ADMIN_PASSWORD: str = "ChangeThisPassword123!"

    DATABASE_URL: str = "postgresql+psycopg://neondb_owner:npg_ea5NjbECly1L@ep-rough-poetry-azusyynm.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    
    UPLOAD_DIR: str = "./uploads"
    VECTOR_DB_DIR: str = "./vector_db"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # Resend Production Email Settings
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "LearnGen AI <onboarding@resend.dev>"
    OTP_EXPIRE_MINUTES: int = 10
    OTP_RESEND_COOLDOWN_SECONDS: int = 60

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://learngen-ai.vercel.app",
        "https://learngen-ai-backend.onrender.com"
    ]

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")
        extra = "ignore"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.VECTOR_DB_DIR, exist_ok=True)

