"""
models.py - SQLAlchemy ORM models (Python classes that map to DB tables).

WHY: ORM lets you work with Python objects instead of writing raw SQL.
Each class here becomes a table. Relationships allow joining tables easily.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # bcrypt hash
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships — allows user.resumes, user.interviews, etc.
    resumes = relationship("Resume", back_populates="user", cascade="all, delete")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255))
    file_path = Column(Text)
    resume_text = Column(Text)  # extracted PDF text
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    resume_score = Column(Integer, default=0)
    skills = Column(JSON)        # list of strings
    strengths = Column(JSON)     # list of strings
    weaknesses = Column(JSON)    # list of strings
    projects = Column(JSON)      # list of {name, description, technologies}
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    matches = relationship("JobMatch", back_populates="job", cascade="all, delete")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    match_score = Column(Integer, default=0)
    matching_skills = Column(JSON)
    missing_skills = Column(JSON)
    suggestions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="job_matches")
    job = relationship("JobDescription", back_populates="matches")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    job_description = Column(Text)
    status = Column(String(20), default="active")  # active | completed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="interview", cascade="all, delete")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)
    category = Column(String(50))    # technical | behavioral | project
    question_text = Column(Text)
    order_index = Column(Integer)

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("InterviewAnswer", back_populates="question", uselist=False, cascade="all, delete")


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id"), nullable=False)
    answer_text = Column(Text)
    score = Column(Integer, default=0)   # 0-100
    feedback = Column(Text)
    strengths = Column(JSON)
    improvements = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="answer")
