"""
interviews.py - Interview session creation, question listing, and answer evaluation.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.auth_dep import get_current_user
from app.models.models import User, Resume, Interview, InterviewQuestion, InterviewAnswer
from app.schemas.schemas import StartInterviewRequest, SubmitAnswerRequest
from app.services.ai_service import generate_interview_questions, evaluate_answer

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])


@router.post("")
def start_interview(
    data: StartInterviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get resume text
    resume_text = data.resume_text or ""
    if data.resume_id and not resume_text:
        resume = db.query(Resume).filter(Resume.id == data.resume_id, Resume.user_id == current_user.id).first()
        if resume and resume.resume_text:
            resume_text = resume.resume_text

    if not resume_text:
        raise HTTPException(status_code=400, detail="Provide resume_id or resume_text")

    # Generate questions with Gemini
    try:
        questions_data = generate_interview_questions(resume_text, data.job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI question generation failed: {str(e)}")

    # Create interview session
    interview = Interview(
        user_id=current_user.id,
        resume_id=data.resume_id,
        job_description=data.job_description,
        status="active",
    )
    db.add(interview)
    db.flush()

    # Save all questions
    order = 1
    all_questions = []

    for category, key in [
        ("technical", "technical_questions"),
        ("behavioral", "behavioral_questions"),
        ("project", "project_questions"),
    ]:
        for q_text in questions_data.get(key, []):
            q = InterviewQuestion(
                interview_id=interview.id,
                category=category,
                question_text=q_text,
                order_index=order,
            )
            db.add(q)
            db.flush()
            all_questions.append({"id": q.id, "category": category, "question_text": q_text, "order_index": order, "answered": False})
            order += 1

    db.commit()

    return {
        "session_id": interview.id,
        "questions": all_questions,
    }


@router.get("")
def list_interviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interviews = db.query(Interview).filter(Interview.user_id == current_user.id).order_by(Interview.id.desc()).all()
    result = []
    for iv in interviews:
        total = len(iv.questions)
        answered = sum(1 for q in iv.questions if q.answer is not None)
        scores = [q.answer.score for q in iv.questions if q.answer and q.answer.score is not None]
        avg = round(sum(scores) / len(scores), 1) if scores else 0
        result.append({
            "id": iv.id,
            "status": iv.status,
            "created_at": iv.created_at,
            "total_questions": total,
            "answered": answered,
            "average_score": avg,
        })
    return result


@router.get("/{interview_id}")
def get_interview(interview_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interview = db.query(Interview).filter(Interview.id == interview_id, Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    questions = []
    for q in sorted(interview.questions, key=lambda x: x.order_index):
        q_data = {
            "id": q.id,
            "category": q.category,
            "question_text": q.question_text,
            "order_index": q.order_index,
            "answered": q.answer is not None,
            "answer": None,
        }
        if q.answer:
            q_data["answer"] = {
                "answer_text": q.answer.answer_text,
                "score": q.answer.score,
                "feedback": q.answer.feedback,
                "strengths": q.answer.strengths,
                "improvements": q.answer.improvements,
            }
        questions.append(q_data)

    return {
        "id": interview.id,
        "status": interview.status,
        "created_at": interview.created_at,
        "questions": questions,
    }


@router.post("/{interview_id}/answer/{question_id}")
def submit_answer(
    interview_id: int,
    question_id: int,
    data: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify ownership
    question = (
        db.query(InterviewQuestion)
        .join(Interview)
        .filter(
            InterviewQuestion.id == question_id,
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Evaluate with AI
    try:
        evaluation = evaluate_answer(question.question_text, data.answer_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI evaluation failed: {str(e)}")

    # Save or update answer
    if question.answer:
        answer = question.answer
        answer.answer_text = data.answer_text
        answer.score = evaluation.get("score", 0)
        answer.feedback = evaluation.get("feedback", "")
        answer.strengths = evaluation.get("strengths", [])
        answer.improvements = evaluation.get("improvements", [])
    else:
        answer = InterviewAnswer(
            question_id=question.id,
            answer_text=data.answer_text,
            score=evaluation.get("score", 0),
            feedback=evaluation.get("feedback", ""),
            strengths=evaluation.get("strengths", []),
            improvements=evaluation.get("improvements", []),
        )
        db.add(answer)

    # Check if all questions answered → mark completed
    interview = question.interview
    db.flush()
    all_answered = all(q.answer is not None for q in interview.questions)
    if all_answered:
        interview.status = "completed"

    db.commit()

    return {
        "score": answer.score,
        "feedback": answer.feedback,
        "strengths": answer.strengths,
        "improvements": answer.improvements,
    }
