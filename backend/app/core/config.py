"""
config.py - Application settings loaded from environment variables.

WHY: Centralizing all config here means you change one .env file
and everything updates. No hardcoded secrets anywhere.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Resume Analyzer AI"
    DEBUG: bool = True

    # Database - SQLite by default (no install needed)
    # To switch to PostgreSQL: DATABASE_URL = "postgresql://user:pass@localhost/dbname"
    DATABASE_URL: str = "sqlite:///./resume_ai.db"

    # JWT Authentication
    SECRET_KEY: str = "change-this-in-production-use-a-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"


# Single instance used everywhere
settings = Settings()
