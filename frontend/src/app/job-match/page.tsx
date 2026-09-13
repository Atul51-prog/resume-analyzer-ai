'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import ScoreCircle from '../../components/ScoreCircle';
import toast from 'react-hot-toast';
import { getResumes } from '../../services/resumeService';
import { matchJob } from '../../services/jobService';
import { ResumeItem, JobMatchResult } from '../../types';
import { Target, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

export default function JobMatchPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  const [jobTitle, setJobTitle] = useState('Software Development Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  useEffect(() => {
    getResumes()
      .then((items) => {
        setResumes(items);
        if (items.length > 0) {
          setSelectedResumeId(items[0].id);
        }
      })
      .catch((err) => console.log('Error loading resumes', err));
  }, []);

  const handleMatch = async () => {
    if (!selectedResumeId) {
      toast.error('Please upload or select a resume first');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter the target job description');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Matching skills and requirements...', { id: 'match-step' });
      const data = await matchJob(Number(selectedResumeId), jobDescription, jobTitle);
      setResult(data);
      toast.success('Match analysis complete!', { id: 'match-step' });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Job matching failed', { id: 'match-step' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Header card */}
        <Card className="mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Job Description Matcher</h1>
              <p className="text-xs text-slate-400">Evaluate alignment against job postings to identify missing keywords and skills</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Select Base Resume
              </label>
              {resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.filename} ({new Date(r.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400">
                  No resume found. Please <a href="/resume" className="text-blue-400 underline">upload one first</a>.
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. SDE 1 / Full Stack Engineer"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements, qualifications, and responsibilities here..."
                rows={5}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={handleMatch} disabled={loading}>
              {loading ? 'Evaluating Match...' : 'Match Resume vs Job'}
            </Button>
          </div>
        </Card>

        {/* Match Result Display */}
        {result && (
          <AnimatedCard>
            <div className="space-y-8">
              <Card className="p-6 sm:p-8">
                <ScoreCircle score={result.match_score} label="Job Alignment Score" />
              </Card>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Matching Skills */}
                <Card className="p-6">
                  <h3 className="text-base font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Matching Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matching_skills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium px-3 py-1 rounded-lg text-xs"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Missing Skills */}
                <Card className="p-6">
                  <h3 className="text-base font-semibold text-rose-400 mb-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Missing / Unmentioned Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium px-3 py-1 rounded-lg text-xs"
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Suggestions */}
              <Card className="p-6">
                <h3 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Recommended Adjustments
                </h3>
                <div className="space-y-2.5">
                  {result.suggestions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-300 leading-relaxed"
                    >
                      💡 {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </AnimatedCard>
        )}
      </PageContainer>
    </>
  );
}
