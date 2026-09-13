"""
database.py - SQLAlchemy engine and session setup.

WHY: SQLAlchemy ORM lets you write Python classes instead of raw SQL.
Alembic uses this engine to manage schema migrations.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# connect_args is only needed for SQLite (allows multithreaded access)
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

# SessionLocal is a factory — each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def create_tables():
    """Create all tables if they don't exist. Called once at startup."""
    Base.metadata.create_all(bind=engine)
