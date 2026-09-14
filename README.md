# Resume Analyzer AI

An AI-powered career preparation platform built with Next.js and FastAPI. It analyzes resumes, matches job descriptions, generates mock interview questions with AI feedback, creates personalized learning roadmaps, and writes cover letters — all in one place.

🚀 **Live App:** [https://resume-analyzer-ai-theta.vercel.app](https://resume-analyzer-ai-theta.vercel.app)

---

## 🎥 Video Demo

Click the preview below to watch the complete demo on YouTube:

[![Resume Analyzer AI Demo](https://img.youtube.com/vi/4gdjzbwIht0/maxresdefault.jpg)](https://youtu.be/4gdjzbwIht0)

> 📺 **YouTube Link:** [https://youtu.be/4gdjzbwIht0](https://youtu.be/4gdjzbwIht0)

---

## What It Does

- **AI Resume Analyzer:** Upload a PDF resume to get an ATS score (0–100), skill extraction, strengths, weaknesses, and improvement suggestions powered by Google Gemini.
- **Job Match Analyzer:** Paste a job description to compare it against your resume — see matching skills, missing skills, and actionable suggestions.
- **AI Mock Interviews:** Generate personalized technical and behavioral interview questions. Submit answers and get instant rubric-based AI feedback with PDF export.
- **Learning Roadmap Generator:** Get a structured 4-week milestone curriculum tailored to your target engineering role.
- **Cover Letter Generator:** AI writes a job-specific cover letter based on your resume and the target job description.
- **Readiness Dashboard:** Track historical performance, average interview scores, and all past analyses in one place.
- **Authentication:** JWT-based register and login with bcrypt password hashing.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide React
- **Backend:** Python, FastAPI, SQLAlchemy (SQLite), Pydantic v2, PyMuPDF
- **AI:** Google Gemini 2.5 Flash (`google-generativeai`)
- **Auth:** JWT tokens + native bcrypt
- **Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

```
resume-analyzer-ai/
├── backend/
│   ├── app/
│   │   ├── api/         # Route handlers — auth, resumes, jobs, interviews, dashboard, utilities
│   │   ├── core/        # JWT auth, security, config
│   │   ├── db/          # SQLAlchemy engine and session
│   │   ├── models/      # ORM models — User, Resume, Analysis, JobMatch, Interview, Answer
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   └── services/    # Gemini AI service, PyMuPDF PDF extraction
│   ├── main.py          # FastAPI app entry point with CORS
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/         # Next.js App Router pages
    │   ├── components/  # Reusable UI — Navbar, Card, Button, ScoreCircle, Charts
    │   ├── context/     # AuthContext provider
    │   ├── services/    # Axios API client and service modules
    │   └── types/       # TypeScript type definitions
    └── package.json
```

---

## Running Locally

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Add your Gemini API key to `backend/.env`:
```
GEMINI_API_KEY=your_key_here
SECRET_KEY=your_jwt_secret
DATABASE_URL=sqlite:///./resume_analyzer.db
```

> API docs available at **http://localhost:8000/docs**

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> App runs at **http://localhost:3000**
