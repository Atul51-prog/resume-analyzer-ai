'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, FileText, Target, Mic, Map, Mail, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Engineering Career Readiness Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-100 leading-tight">
            Technical Resume Analysis &{' '}
            <span className="text-blue-500">
              Mock Interview System
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Extract structured candidate signals, evaluate ATS keyword compatibility, practice targeted technical mock interviews, and build personalized roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-sm transition flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-6 py-16 w-full">
          <div className="border-b border-slate-800 pb-8 mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-100">
                Core Capabilities
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Full-stack architecture built with Next.js, FastAPI, and SQLAlchemy.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<FileText className="h-5 w-5 text-blue-400" />}
              title="Resume ATS Analyzer"
              description="High-speed PDF text parsing via PyMuPDF. Calculates ATS alignment scores, extracts technical skills, strengths, and weaknesses."
            />
            <FeatureCard
              icon={<Target className="h-5 w-5 text-indigo-400" />}
              title="Job Description Matcher"
              description="Performs semantic gap analysis between candidate resumes and job postings to surface matching vs missing skills."
            />
            <FeatureCard
              icon={<Mic className="h-5 w-5 text-emerald-400" />}
              title="Technical Mock Interview"
              description="Generates technical, behavioral, and architectural questions with real-time rubric scoring and PDF report downloads."
            />
            <FeatureCard
              icon={<Mail className="h-5 w-5 text-amber-400" />}
              title="Cover Letter Generator"
              description="Drafts tailored cover letters matching job requirements with single-click clipboard copying and PDF export."
            />
            <FeatureCard
              icon={<Map className="h-5 w-5 text-cyan-400" />}
              title="Milestone Roadmaps"
              description="Constructs structured 4-week preparation timelines covering algorithms, system design, and framework proficiencies."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-slate-300" />}
              title="Performance Metrics"
              description="Maintains historical assessment trends, session scores, and candidate profile progress analytics."
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-5xl mx-auto px-6 py-12 w-full border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard number="100%" label="Relational Schema" />
            <StatCard number="< 40ms" label="Auth Latency" />
            <StatCard number="FastAPI" label="Modern Async API" />
            <StatCard number="TypeScript" label="End-to-End Types" />
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-slate-800/80 py-8 text-center text-slate-500 text-xs">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 ResumeAnalyzer AI • Built with FastAPI, Next.js & SQLAlchemy</p>
            <div className="flex gap-4">
              <Link href="/resume" className="hover:text-slate-300">Resume</Link>
              <Link href="/job-match" className="hover:text-slate-300">Job Match</Link>
              <Link href="/interview" className="hover:text-slate-300">Mock Interview</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition shadow-sm">
      <div className="p-2 bg-slate-800/80 rounded-lg w-fit mb-4 text-slate-300">{icon}</div>
      <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-slate-100 mb-1">
        {number}
      </div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  );
}
