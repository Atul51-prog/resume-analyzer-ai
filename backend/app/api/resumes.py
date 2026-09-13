"""
resumes.py - Resume upload, list, get, delete, and AI analysis routes.
"""
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.auth_dep import get_current_user
from app.models.models import User, Resume, ResumeAnalysis
from app.services.resume_service import extract_text_from_pdf
from app.services.ai_service import analyze_resume
from app.core.config import settings

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

# Ensure upload dir exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.MAX_FILE_SIZE_MB}MB)")

    # Save file with unique name to avoid collisions
    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text from PDF
    resume_text = extract_text_from_pdf(file_path)

    # Save resume record in DB
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        resume_text=resume_text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "created_at": resume.created_at,
        "has_analysis": False,
        "resume_text_preview": resume_text[:500] if resume_text else "",
    }


@router.get("")
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "created_at": r.created_at,
            "has_analysis": r.analysis is not None,
        }
        for r in resumes
    ]


@router.get("/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    result = {
        "id": resume.id,
        "filename": resume.filename,
        "created_at": resume.created_at,
        "resume_text": resume.resume_text,
        "has_analysis": resume.analysis is not None,
        "analysis": None,
    }

    if resume.analysis:
        a = resume.analysis
        result["analysis"] = {
            "resume_score": a.resume_score,
            "skills": a.skills,
            "strengths": a.strengths,
            "weaknesses": a.weaknesses,
            "projects": a.projects,
        }

    return result


@router.post("/{resume_id}/analyze")
def analyze_resume_endpoint(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.resume_text:
        raise HTTPException(status_code=400, detail="No text extracted from resume")

    # Call Gemini AI
    try:
        result = analyze_resume(resume.resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Delete existing analysis if any, then save new one
    if resume.analysis:
        db.delete(resume.analysis)
        db.flush()

    analysis = ResumeAnalysis(
        resume_id=resume.id,
        resume_score=result.get("resume_score", 0),
        skills=result.get("skills", []),
        strengths=result.get("strengths", []),
        weaknesses=result.get("weaknesses", []),
        projects=result.get("projects", []),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "resume_score": analysis.resume_score,
        "skills": analysis.skills,
        "strengths": analysis.strengths,
        "weaknesses": analysis.weaknesses,
        "projects": analysis.projects,
    }


@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Delete file from disk
    if resume.file_path and os.path.exists(resume.file_path):
        os.remove(resume.file_path)

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}
