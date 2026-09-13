"""
schemas.py - Pydantic schemas for request validation and response serialization.

WHY: Pydantic validates incoming JSON automatically. If a required field is
missing or has the wrong type, FastAPI returns a clear 422 error — no manual
validation code needed.

Separation: ORM models (models.py) define DB tables.
Pydantic schemas (here) define what the API accepts and returns.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── AUTH ───────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ─── RESUME ─────────────────────────────────────────────────────────────────

class ResumeOut(BaseModel):
    id: int
    filename: str
    created_at: datetime
    has_analysis: bool

    class Config:
        from_attributes = True


class ProjectOut(BaseModel):
    name: str
    description: str
    technologies: List[str]


class AnalysisOut(BaseModel):
    id: int
    resume_id: int
    resume_score: int
    skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    projects: List[ProjectOut]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── JOB MATCH ──────────────────────────────────────────────────────────────

class JobMatchRequest(BaseModel):
    resume_id: int
    title: Optional[str] = "Software Engineer"
    description: str


class JobMatchOut(BaseModel):
    match_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]


# ─── INTERVIEW ───────────────────────────────────────────────────────────────

class StartInterviewRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None
    job_description: str


class QuestionOut(BaseModel):
    id: int
    category: str
    question_text: str
    order_index: int
    answered: bool = False

    class Config:
        from_attributes = True


class InterviewOut(BaseModel):
    id: int
    status: str
    created_at: datetime
    questions: List[QuestionOut]

    class Config:
        from_attributes = True


class SubmitAnswerRequest(BaseModel):
    answer_text: str


class AnswerEvaluationOut(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    improvements: List[str]


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

class DashboardOut(BaseModel):
    total_resumes: int
    total_interviews: int
    average_interview_score: float
    highest_score: int
    lowest_score: int
    latest_resume_score: int
    recent_activity: List[str]


# ─── UTILITIES ───────────────────────────────────────────────────────────────

class RoadmapRequest(BaseModel):
    resume_text: str
    target_role: str


class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
