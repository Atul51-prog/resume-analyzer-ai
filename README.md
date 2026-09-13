<h1 align="center">
  <img src="https://img.shields.io/badge/ResumeAnalyzer-AI-blue?style=for-the-badge&logo=google&logoColor=white" alt="ResumeAnalyzer AI"/>
</h1>

<h3 align="center">🚀 AI-Powered Resume Analyzer & Mock Interview Platform</h3>

<p align="center">
  A production-grade, full-stack AI career preparation platform — analyze resumes, match jobs, practice mock interviews, and generate roadmaps powered by Google Gemini.
</p>

<p align="center">
  <a href="https://resume-analyzer-ai-theta.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-resume--analyzer--ai--theta.vercel.app-0070f3?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript"/>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python"/>
  <img src="https://img.shields.io/badge/Gemini-2.5 Flash-FF6F00?style=flat-square&logo=google"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss"/>
  <img src="https://img.shields.io/badge/Deployed on-Vercel-black?style=flat-square&logo=vercel"/>
</p>

---

## 🎬 Demo Video

<!-- Replace the link below with your YouTube video URL after uploading -->
<p align="center">
  <a href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" target="_blank">
    <img src="https://img.shields.io/badge/▶ Watch Demo on YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Demo"/>
  </a>
</p>

> 📹 _Demo video coming soon — subscribe to be notified!_

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based register & login with bcrypt password hashing |
| 📄 **AI Resume Analyzer** | Upload PDF → ATS score (0–100), skills extraction, strengths & weaknesses |
| 💼 **Job Match Analyzer** | Compare resume vs job description → matching/missing skills + suggestions |
| 🎤 **AI Mock Interviews** | Personalized technical + behavioral questions, rubric-scored answers, PDF export |
| 🗺️ **Learning Roadmap** | 4-week milestone curriculum tailored to your target role |
| ✉️ **Cover Letter Generator** | AI-drafted cover letters matching the job description |
| 📊 **Readiness Dashboard** | Track performance trends, average scores, and past analyses |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (dark theme — Linear/Vercel inspired)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ORM**: SQLAlchemy + SQLite (drop-in PostgreSQL support)
- **AI Engine**: Google Gemini `gemini-2.5-flash` via `google-generativeai`
- **PDF Parsing**: PyMuPDF (`pymupdf`)
- **Auth**: JWT tokens + native `bcrypt`

---

## 📁 Project Structure

```
resume-analyzer-ai/
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (auth, resumes, jobs, interviews, dashboard, utilities)
│   │   ├── core/           # Security, config, JWT auth dependency
│   │   ├── db/             # SQLAlchemy engine & session dependency
│   │   ├── models/         # ORM models (User, Resume, ResumeAnalysis, JobMatch, Interview, Answer)
│   │   ├── schemas/        # Pydantic v2 validation schemas
│   │   └── services/       # AI service (Gemini), PDF extraction (PyMuPDF)
│   ├── main.py             # FastAPI entry point & CORS
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/            # Next.js App Router pages
    │   ├── components/     # Reusable UI (Navbar, Card, Button, ScoreCircle, Charts)
    │   ├── context/        # AuthContext provider
    │   ├── services/       # Axios API client & service modules
    │   └── types/          # TypeScript definitions
    ├── vercel.json
    └── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key → [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/Atul51-prog/resume-analyzer-ai.git
cd resume-analyzer-ai
```

### 2. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit backend/.env and add your GEMINI_API_KEY

# Start server (http://localhost:8000)
uvicorn main:app --reload --port 8000
```

> 📖 Swagger API Docs available at **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server (http://localhost:3000)
npm run dev
```

---

## 🌐 Deployment

| Service | Status |
|---------|--------|
| **Frontend** → Vercel | ✅ Live at [resume-analyzer-ai-theta.vercel.app](https://resume-analyzer-ai-theta.vercel.app) |
| **Backend** → Render | 🔧 Deploy your own instance (see [DEPLOYMENT.md](./DEPLOYMENT.md)) |

### Environment Variables

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Backend (Render)**:
```
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=sqlite:///./resume_analyzer.db
```

---

## 📸 Screenshots

> _Screenshots coming soon_

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Atul Kumar**

<p>
  <a href="https://github.com/Atul51-prog">
    <img src="https://img.shields.io/badge/GitHub-Atul51--prog-181717?style=flat-square&logo=github"/>
  </a>
</p>

---

<p align="center">
  Made with ❤️ and powered by Google Gemini AI
</p>
