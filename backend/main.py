"""
main.py - FastAPI application entry point.

This file:
1. Creates the FastAPI app
2. Configures production-ready CORS
3. Initializes database tables on startup
4. Registers all API routers
5. Exposes /health and OpenAPI docs
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_tables
from app.api import auth, resumes, jobs, interviews, dashboard, utilities

app = FastAPI(
    title="Resume Analyzer AI",
    description="AI-powered technical resume analysis, job matching, and mock interview platform",
    version="1.0.0",
)

# CORS — allows local dev and deployed production frontend domains (Vercel, Render, etc.)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Allow any custom frontend domain from environment variable if provided
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url.strip().rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if os.getenv("ENVIRONMENT") == "strict" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Create all DB tables on startup if they don't exist."""
    create_tables()


# Register all routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(jobs.router)
app.include_router(interviews.router)
app.include_router(dashboard.router)
app.include_router(utilities.router)


@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Resume Analyzer AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }
