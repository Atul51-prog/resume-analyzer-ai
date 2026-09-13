'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import toast from 'react-hot-toast';
import { getResumes } from '../../services/resumeService';
import { startInterview, evaluateAnswer } from '../../services/interviewService';
import { downloadInterviewReportPDF } from '../../services/pdfService';
import { ResumeItem, InterviewQuestionItem, AnswerEvaluation } from '../../types';
import {
  Mic,
  MicOff,
  Send,
  Download,
  CheckCircle2,
} from 'lucide-react';

export default function InterviewPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  const [jobDescription, setJobDescription] = useState(
    'Target Software Development Engineer (SDE 1) role focusing on Data Structures, Algorithms, PostgreSQL, FastAPI/Node.js, and scalable web architecture.'
  );

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestionItem | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);

  useEffect(() => {
    getResumes()
      .then((items) => {
        setResumes(items);
        if (items.length > 0) setSelectedResumeId(items[0].id);
      })
      .catch((err) => console.log('Error loading resumes', err));
  }, []);

  const handleStartInterview = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a target job description');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Generating targeted questions...', { id: 'interview-start' });
      const res = await startInterview(
        jobDescription,
        selectedResumeId ? Number(selectedResumeId) : undefined
      );

      setSessionId(res.session_id);
      setQuestions(res.questions);
      if (res.questions.length > 0) {
        setActiveQuestion(res.questions[0]);
      }
      toast.success('Interview session prepared!', { id: 'interview-start' });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to start interview', { id: 'interview-start' });
    } finally {
      setLoading(false);
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser. Please type your response.');
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onstart = () => setIsRecording(true);
    recog.onend = () => setIsRecording(false);
    recog.onerror = () => setIsRecording(false);

    recog.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswerText(transcript);
    };

    setRecognition(recog);
    recog.start();
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || !activeQuestion) return;
    if (!answerText.trim()) {
      toast.error('Please provide an answer to evaluate');
      return;
    }

    try {
      setEvaluating(true);
      toast.loading('Evaluating technical response...', { id: 'eval-step' });
      const evalRes = await evaluateAnswer(sessionId, activeQuestion.id, answerText);
      setEvaluation(evalRes);

      setQuestions((prev) =>
        prev.map((q) => (q.id === activeQuestion.id ? { ...q, answered: true } : q))
      );
      toast.success('Evaluation complete!', { id: 'eval-step' });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to evaluate answer', { id: 'eval-step' });
    } finally {
      setEvaluating(false);
    }
  };

  const completedCount = questions.filter((q) => q.answered).length;

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Setup card */}
        <Card className="mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Technical Mock Interview</h1>
              <p className="text-xs text-slate-400">Practice technical and behavioral questions with instant scoring feedback</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Candidate Profile Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">No Resume (Standard Probe Set)</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Role / Focus Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. SDE 1 - focus on DSA, System Design, and Low Level Architecture..."
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={handleStartInterview} disabled={loading}>
              {loading ? 'Preparing Questions...' : 'Start Mock Session'}
            </Button>
          </div>
        </Card>

        {/* Questions and Simulator Area */}
        {questions.length > 0 && (
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">Session Progress</span>
                <span className="text-xs font-semibold text-blue-400">
                  {completedCount} of {questions.length} completed
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(completedCount / questions.length) * 100}%` }}
                />
              </div>
            </Card>

            {/* Question Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {questions.map((q, idx) => {
                const isSelected = activeQuestion?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setActiveQuestion(q);
                      setAnswerText('');
                      setEvaluation(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {q.category} • #{idx + 1}
                      </span>
                      {q.answered && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{q.question_text}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Question & Answer Box */}
            {activeQuestion && (
              <AnimatedCard>
                <Card className="p-6">
                  <div className="mb-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                      {activeQuestion.category} Question
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                      {activeQuestion.question_text}
                    </h3>
                  </div>

                  {/* Answer Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Your Response
                      </label>
                      <div className="flex items-center gap-2">
                        {isRecording ? (
                          <button
                            onClick={stopVoiceRecording}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium animate-pulse"
                          >
                            <MicOff className="h-3 w-3" /> Stop Mic
                          </button>
                        ) : (
                          <button
                            onClick={startVoiceRecording}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                          >
                            <Mic className="h-3 w-3 text-slate-400" /> Voice Input
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type or dictate your technical response..."
                      rows={6}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition resize-none leading-relaxed"
                    />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] text-slate-400">{answerText.length} characters</span>
                      <Button onClick={handleSubmitAnswer} disabled={evaluating}>
                        <Send className="h-3.5 w-3.5" />
                        {evaluating ? 'Evaluating...' : 'Submit Response'}
                      </Button>
                    </div>
                  </div>

                  {/* Answer Evaluation Feedback */}
                  {evaluation && (
                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Evaluation Breakdown
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
                            Score: {evaluation.score} / 100
                          </div>
                          <button
                            onClick={() =>
                              downloadInterviewReportPDF(
                                activeQuestion.question_text,
                                answerText,
                                evaluation
                              )
                            }
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 text-xs font-medium"
                          >
                            <Download className="h-3.5 w-3.5" /> PDF
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-slate-100 block mb-0.5">Feedback:</strong>
                        {evaluation.feedback}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <h5 className="font-semibold text-emerald-400 text-xs mb-2">Strengths</h5>
                          <ul className="space-y-1.5 text-xs text-emerald-300">
                            {evaluation.strengths?.map((s, i) => (
                              <li key={i}>✓ {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <h5 className="font-semibold text-amber-400 text-xs mb-2">Areas for Improvement</h5>
                          <ul className="space-y-1.5 text-xs text-amber-300">
                            {evaluation.improvements?.map((imp, i) => (
                              <li key={i}>⚠ {imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </AnimatedCard>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}
