'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import ScoreCircle from '../../components/ScoreCircle';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import toast from 'react-hot-toast';
import { uploadResume, analyzeResume, getResumes, deleteResume } from '../../services/resumeService';
import { ResumeItem, ResumeAnalysis } from '../../types';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Trash2,
  Layers,
} from 'lucide-react';

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [activeResume, setActiveResume] = useState<ResumeItem | null>(null);
  const [history, setHistory] = useState<ResumeItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await getResumes();
      setHistory(items);
      if (items.length > 0 && !activeResume) {
        setActiveResume(items[0]);
      }
    } catch (e) {
      console.log('Failed to load history', e);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      toast.error('Please select a PDF resume');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Extracting document text...', { id: 'resume-step' });
      const uploaded = await uploadResume(file);

      toast.loading('Analyzing ATS keywords & engineering signals...', { id: 'resume-step' });
      setAnalyzingId(uploaded.id);
      const analysis = await analyzeResume(uploaded.id);

      setCurrentAnalysis(analysis);
      setActiveResume(uploaded);
      toast.success('Resume analysis complete!', { id: 'resume-step' });
      loadHistory();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Analysis failed. Check server connection.', {
        id: 'resume-step',
      });
    } finally {
      setLoading(false);
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResume(id);
      toast.success('Resume deleted');
      if (activeResume?.id === id) {
        setActiveResume(null);
        setCurrentAnalysis(null);
      }
      loadHistory();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleAnalyzeExisting = async (resume: ResumeItem) => {
    try {
      setAnalyzingId(resume.id);
      toast.loading('Analyzing resume...', { id: 'analyze-step' });
      const analysis = await analyzeResume(resume.id);
      setCurrentAnalysis(analysis);
      setActiveResume(resume);
      toast.success('Analysis updated!', { id: 'analyze-step' });
      loadHistory();
    } catch (e) {
      toast.error('Failed to analyze', { id: 'analyze-step' });
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Upload Card */}
        <Card className="mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Resume ATS Analyzer</h1>
              <p className="text-xs text-slate-400">Upload PDF resume for ATS scoring, technology detection, and structured review</p>
            </div>
          </div>

          <div className="mt-6 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-xl p-8 text-center transition">
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                {file ? file.name : 'Select or drag PDF resume here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Standard PDF document up to 10MB</p>
            </label>

            {file && (
              <div className="mt-5 flex justify-center">
                <Button onClick={handleUploadAndAnalyze} disabled={loading}>
                  {loading ? 'Processing Analysis...' : 'Run ATS Analysis'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Display Analysis Results */}
        {currentAnalysis && (
          <AnimatedCard>
            <div className="space-y-8">
              {/* ATS Score Card */}
              <Card className="p-6 sm:p-8">
                <ScoreCircle score={currentAnalysis.resume_score} label="ATS Compatibility Score" />
              </Card>

              {/* Skills Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-400" /> Extracted Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.skills && currentAnalysis.skills.length > 0 ? (
                    currentAnalysis.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-800 border border-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs">No explicit technical skills identified.</p>
                  )}
                </div>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-5">
                <Card className="p-6">
                  <h3 className="text-base font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Validated Strengths
                  </h3>
                  <div className="space-y-2.5">
                    {currentAnalysis.strengths?.map((str, index) => (
                      <div
                        key={index}
                        className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300 leading-relaxed"
                      >
                        ✓ {str}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                  </h3>
                  <div className="space-y-2.5">
                    {currentAnalysis.weaknesses?.map((weak, index) => (
                      <div
                        key={index}
                        className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300 leading-relaxed"
                      >
                        ⚠ {weak}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Extracted Projects */}
              {currentAnalysis.projects && currentAnalysis.projects.length > 0 && (
                <div>
                  <SectionTitle>
                    <Layers className="h-5 w-5 text-indigo-400" /> Extracted Projects
                  </SectionTitle>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentAnalysis.projects.map((proj, idx) => (
                      <Card key={idx} className="p-5 hover:border-slate-700 transition">
                        <h4 className="text-sm font-bold text-slate-100 mb-1.5">{proj.name}</h4>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies?.map((tech, i) => (
                            <span
                              key={i}
                              className="bg-slate-800 border border-slate-700/80 text-slate-300 px-2.5 py-0.5 rounded-md text-[11px] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        )}

        {/* Resume History Vault */}
        {history.length > 0 && (
          <div className="mt-12">
            <SectionTitle>Uploaded Documents ({history.length})</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">{item.filename}</p>
                      <p className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAnalyzeExisting(item)}
                      disabled={analyzingId === item.id}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 text-xs font-medium transition"
                    >
                      {analyzingId === item.id ? '...' : 'Analyze'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}
