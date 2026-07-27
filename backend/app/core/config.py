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

    DATABASE_URL: str = "sqlite:///./learngen_ai.db"
    
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
