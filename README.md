# Resume Analyzer AI & Mock Interview Platform

A production-grade, full-stack AI career preparation platform built from scratch.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts + Framer Motion
- **Backend**: Python 3.10+ + FastAPI + SQLAlchemy ORM + Pydantic v2
- **Database**: SQLite (default, zero configuration) or PostgreSQL via SQLAlchemy
- **AI Engine**: Google Gemini (`gemini-2.5-flash`) via `google-generativeai` with `json-repair`
- **PDF Engine**: PyMuPDF (`fitz`) for robust document parsing
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing

---

## 🚀 How to Run the Project

### 1. Backend (FastAPI)

```powershell
cd "C:\Users\Atul kumar\Desktop\resume-analyzer-ai\backend"

# Create & activate virtualenv (optional)
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (runs on http://127.0.0.1:8000)
uvicorn main:app --reload --port 8000
```

> **API Documentation**: Interactive Swagger UI is available at **http://127.0.0.1:8000/docs**

---

### 2. Frontend (Next.js)

Open a second terminal window:

```powershell
cd "C:\Users\Atul kumar\Desktop\resume-analyzer-ai\frontend"

# Install dependencies
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

Visit **http://localhost:3000** in your browser!

---

## 🌟 Core Features

1. **Authentication**: JWT-based user register/login with hashed credentials.
2. **AI Resume Analyzer**: Upload any PDF resume to extract clean text, calculate ATS match score (0-100), extract technical skills, strengths, weaknesses, and project portfolio.
3. **Job Match Analyzer**: Compare any resume against job postings to identify matching vs. missing skills and actionable suggestions.
4. **AI Technical Mock Interview**: Generate personalized technical, behavioral, and project questions. Record answers via speech recognition or text and receive instant rubric evaluation scores with PDF export.
5. **4-Week Learning Roadmap**: Generate structured milestone curriculums tailored to target engineering roles.
6. **AI Cover Letter Generator**: Draft high-converting cover letters matching target job descriptions with instant copy & PDF download.
7. **Readiness Dashboard**: Track historical performance trends, average mock scores, and previous analyses.

---

## 📁 Architecture Overview

```
resume-analyzer-ai/
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (auth, resumes, jobs, interviews, dashboard, utilities)
│   │   ├── core/           # Security, config, JWT auth dependency
│   │   ├── db/             # SQLAlchemy engine & session dependency
│   │   ├── models/         # ORM models (User, Resume, ResumeAnalysis, JobMatch, Interview, Answer)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── services/       # Business logic (Gemini AI service, PyMuPDF extraction)
│   ├── main.py             # FastAPI entry point & CORS
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/            # Next.js App Router pages (Landing, Login, Dashboard, Resume, Mock, etc.)
    │   ├── components/     # Reusable UI components (Navbar, Card, Button, ScoreCircle, Charts)
    │   ├── context/        # Auth Context provider
    │   ├── services/       # Axios API client & endpoints
    │   └── types/          # TypeScript definitions
    └── package.json
```
