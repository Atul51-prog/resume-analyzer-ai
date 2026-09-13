"""
jobs.py - Job description saving and resume-job matching routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.auth_dep import get_current_user
from app.models.models import User, Resume, JobDescription, JobMatch
from app.schemas.schemas import JobMatchRequest
from app.services.ai_service import match_resume_with_job

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("/match")
def match_job(
    data: JobMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get the resume
    resume = db.query(Resume).filter(Resume.id == data.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.resume_text:
        raise HTTPException(status_code=400, detail="No text in resume")

    # Call Gemini AI
    try:
        result = match_resume_with_job(resume.resume_text, data.description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI matching failed: {str(e)}")

    # Save job description
    job = JobDescription(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
    )
    db.add(job)
    db.flush()  # get job.id without committing

    # Save match result
    match = JobMatch(
        resume_id=resume.id,
        job_id=job.id,
        match_score=result.get("match_score", 0),
        matching_skills=result.get("matching_skills", []),
        missing_skills=result.get("missing_skills", []),
        suggestions=result.get("suggestions", []),
    )
    db.add(match)
    db.commit()

    return {
        "match_score": match.match_score,
        "matching_skills": match.matching_skills,
        "missing_skills": match.missing_skills,
        "suggestions": match.suggestions,
    }
