'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import toast from 'react-hot-toast';
import { generateCoverLetter } from '../../services/coverLetterService';
import { jsPDF } from 'jspdf';
import { Mail, Copy, Download, FileCheck } from 'lucide-react';

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter the target job description');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Drafting tailored cover letter...', { id: 'cover-step' });
      const res = await generateCoverLetter(resumeText, jobDescription);
      setCoverLetter(res.cover_letter);
      toast.success('Cover letter generated!', { id: 'cover-step' });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Generation failed', { id: 'cover-step' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = 175;
    const lines = doc.splitTextToSize(coverLetter, pageWidth);

    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Application Cover Letter', 18, 20);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    let y = 32;

    lines.forEach((line: string) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 18, y);
      y += 6;
    });

    doc.save('Cover_Letter.pdf');
    toast.success('Cover letter downloaded!');
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Setup card */}
        <Card className="mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Cover Letter Generator</h1>
              <p className="text-xs text-slate-400">Generate professional, role-tailored cover letters matching job postings</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Resume Skills / Background Notes
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste key skills, projects, and achievements to include in the narrative..."
                rows={5}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the role requirements and qualifications here..."
                rows={5}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Drafting Letter...' : 'Generate Letter'}
            </Button>
          </div>
        </Card>

        {/* Cover Letter Output Display */}
        {coverLetter && (
          <AnimatedCard>
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-emerald-400" /> Generated Draft
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Edit, copy to clipboard, or export to PDF</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
                  >
                    <Copy className="h-3 w-3" /> Copy Text
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
                  >
                    <Download className="h-3 w-3" /> Download PDF
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5">
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={14}
                  className="w-full bg-transparent text-slate-200 text-xs leading-relaxed focus:outline-none resize-y"
                />
              </div>
            </Card>
          </AnimatedCard>
        )}
      </PageContainer>
    </>
  );
}
