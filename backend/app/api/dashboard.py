"""
dashboard.py - Dashboard aggregated stats route.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.auth_dep import get_current_user
from app.models.models import User, Resume, Interview, ResumeAnalysis, InterviewAnswer

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    interviews = db.query(Interview).filter(Interview.user_id == current_user.id).all()

    # Collect all answer scores
    all_scores = []
    for iv in interviews:
        for q in iv.questions:
            if q.answer and q.answer.score is not None:
                all_scores.append(q.answer.score)

    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0
    highest = max(all_scores) if all_scores else 0
    lowest = min(all_scores) if all_scores else 0

    # Latest resume ATS score
    latest_resume_score = 0
    if resumes:
        latest = resumes[-1]
        if latest.analysis:
            latest_resume_score = latest.analysis.resume_score

    # Recent activity (last 6 events)
    activity = []
    for r in sorted(resumes, key=lambda x: x.created_at, reverse=True)[:3]:
        score = r.analysis.resume_score if r.analysis else 0
        activity.append(f"📄 Resume '{r.filename}' analyzed — ATS Score: {score}")

    for iv in sorted(interviews, key=lambda x: x.created_at, reverse=True)[:3]:
        scores = [q.answer.score for q in iv.questions if q.answer]
        avg = round(sum(scores) / len(scores), 1) if scores else 0
        activity.append(f"🎤 Mock interview completed — Avg Score: {avg}")

    return {
        "total_resumes": len(resumes),
        "total_interviews": len(interviews),
        "average_score": avg_score,
        "highest_score": highest,
        "lowest_score": lowest,
        "latest_resume_score": latest_resume_score,
        "recent_activity": activity[:6],
    }
