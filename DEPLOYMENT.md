# 🚀 Deployment Guide (100% Free Hosting)

Follow these steps to deploy your **Resume Analyzer AI** platform live to the web.

---

## Part 1: Deploy Backend (FastAPI on Render.com)

1. **Push your code to GitHub**:
   - Create a new repository on GitHub (e.g., `resume-analyzer-ai`).
   - Push your code to the repository.

2. **Create a Free Web Service on [Render](https://render.com/)**:
   - Sign up / log in to Render.
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.
   - Configure the service:
     - **Name**: `resume-analyzer-api`
     - **Root Directory**: `backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: `Free`

3. **Add Environment Variables in Render**:
   Under the **Environment** tab, add:
   - `DEBUG`: `False`
   - `SECRET_KEY`: `your-random-secret-key-string-12345`
   - `GEMINI_API_KEY`: `your_gemini_api_key` *(optional)*
   - `DATABASE_URL`: `sqlite:///./resume_ai.db` *(or connect Render PostgreSQL)*

4. Click **Deploy Web Service**!
   Render will give you a public URL (e.g., `https://resume-analyzer-api.onrender.com`).

---

## Part 2: Deploy Frontend (Next.js on Vercel)

1. **Go to [Vercel](https://vercel.com/)**:
   - Sign up / log in with your GitHub account.
   - Click **Add New...** → **Project**.
   - Import your `resume-analyzer-ai` repository.

2. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click edit and select `frontend`.
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: Paste your Render backend URL (e.g., `https://resume-analyzer-api.onrender.com`)

3. Click **Deploy**!
   Vercel will build and deploy your frontend in ~60 seconds to a live URL (e.g., `https://resume-analyzer-ai.vercel.app`).

---

## ✅ Post-Deployment Verification Checklist

- [ ] Visit `https://your-api.onrender.com/health` (should return `{"status": "healthy"}`)
- [ ] Visit `https://your-frontend.vercel.app/`
- [ ] Test registration & login
- [ ] Upload a test resume & view ATS analysis
- [ ] Practice a mock interview session and download the evaluation PDF report
