"""
utilities.py - Roadmap and cover letter generation routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth_dep import get_current_user
from app.models.models import User
from app.schemas.schemas import RoadmapRequest, CoverLetterRequest
from app.services.ai_service import generate_roadmap, generate_cover_letter

router = APIRouter(prefix="/api", tags=["Utilities"])


@router.post("/roadmap")
def roadmap(
    data: RoadmapRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        result = generate_roadmap(data.resume_text, data.target_role)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")


@router.post("/cover-letter")
def cover_letter(
    data: CoverLetterRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        letter = generate_cover_letter(data.resume_text, data.job_description)
        return {"cover_letter": letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")
