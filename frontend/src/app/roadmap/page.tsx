'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import toast from 'react-hot-toast';
import { generateRoadmap } from '../../services/roadmapService';
import { LearningRoadmap } from '../../types';
import { Map, CheckCircle2, Calendar } from 'lucide-react';

export default function RoadmapPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      toast.error('Please specify target role');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Constructing 4-week milestone curriculum...', { id: 'roadmap-step' });
      const data = await generateRoadmap(resumeText, targetRole);
      setRoadmap(data);
      toast.success('Roadmap generated!', { id: 'roadmap-step' });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Roadmap generation failed', { id: 'roadmap-step' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Setup card */}
        <Card className="mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">4-Week Preparation Roadmap</h1>
              <p className="text-xs text-slate-400">Structured milestone study plan designed to master target engineering roles</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Engineering Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Backend SDE 1, Frontend Architect, ML Engineer"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Current Background / Focus Notes (Optional)
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste current skills or specific areas you want emphasized..."
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Building Curriculum...' : 'Generate Roadmap'}
            </Button>
          </div>
        </Card>

        {/* Roadmap Timeline */}
        {roadmap && (
          <AnimatedCard>
            <div className="space-y-6">
              <SectionTitle>
                Preparation Plan for {targetRole}
              </SectionTitle>

              {Object.entries(roadmap).map(([week, tasks], index) => (
                <div key={week} className="flex gap-4">
                  {/* Timeline bullet indicator */}
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {index + 1}
                    </div>
                    {index < Object.entries(roadmap).length - 1 && (
                      <div className="w-px flex-1 bg-slate-800 my-2" />
                    )}
                  </div>

                  {/* Week Card */}
                  <Card className="flex-1 p-5 hover:border-slate-700 transition">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {week.replace('_', ' ')}
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </AnimatedCard>
        )}
      </PageContainer>
    </>
  );
}
