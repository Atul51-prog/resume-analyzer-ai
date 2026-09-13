"""
deps.py - FastAPI dependency for getting a DB session.

WHY: Using `yield` here ensures the DB session is always closed
after each request, even if an exception occurs (like a context manager).
"""
from typing import Generator
from sqlalchemy.orm import Session
from app.db.database import SessionLocal


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
