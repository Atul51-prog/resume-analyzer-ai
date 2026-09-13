'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import PageContainer from '../../components/PageContainer';
import SectionTitle from '../../components/SectionTitle';
import AnimatedCard from '../../components/AnimatedCard';
import SkeletonCard from '../../components/SkeletonCard';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../services/dashboardService';
import { DashboardData } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  FileText,
  Briefcase,
  Mic,
  Map,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => setData(res))
      .catch((err) => console.log('Dashboard error', err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: 'ATS Score', score: data?.latest_resume_score || 85 },
    { name: 'Average', score: data?.average_score || 78 },
    { name: 'Highest', score: data?.highest_score || 92 },
    { name: 'Lowest', score: data?.lowest_score || 65 },
  ];

  return (
    <>
      <Navbar />
      <PageContainer>
        {/* Welcome Header */}
        <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Candidate: <span className="text-slate-200 font-medium">{user?.name || user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/resume"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Upload Resume
            </Link>
            <Link
              href="/interview"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Mic className="h-3.5 w-3.5 text-slate-400" /> Start Mock
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold">Resumes</span>
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mt-1">{data?.total_resumes || 0}</h2>
              <p className="text-[11px] text-slate-400 mt-1">Uploaded to vault</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold">Mock Sessions</span>
                <Mic className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mt-1">{data?.total_interviews || 0}</h2>
              <p className="text-[11px] text-slate-400 mt-1">Completed simulations</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold">Average Score</span>
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-indigo-400 mt-1">{data?.average_score || 0}%</h2>
              <p className="text-[11px] text-slate-400 mt-1">Across technical questions</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold">Latest ATS Score</span>
                <Award className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-400 mt-1">{data?.latest_resume_score || 0}%</h2>
              <p className="text-[11px] text-slate-400 mt-1">Resume optimization level</p>
            </Card>
          </div>
        )}

        {/* Middle Section: Chart + Performance + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {/* Performance Summary Card */}
          <Card className="p-6">
            <h2 className="text-base font-semibold mb-4 text-slate-100 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" /> Performance Extremes
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highest Score</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Top session result</p>
                </div>
                <span className="text-2xl font-bold text-emerald-400">{data?.highest_score || 0}%</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lowest Score</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Baseline benchmark</p>
                </div>
                <span className="text-2xl font-bold text-amber-400">{data?.lowest_score || 0}%</span>
              </div>
            </div>
          </Card>

          {/* Analytics Chart */}
          <Card className="p-6">
            <h2 className="text-base font-semibold mb-3 text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Score Metrics Trend
            </h2>
            <div className="h-[200px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6">
            <h2 className="text-base font-semibold mb-4 text-slate-100 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-400" /> Quick Workflows
            </h2>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/resume"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-200">Resume Analyzer</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-400 transition" />
              </Link>

              <Link
                href="/job-match"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-200">Job Description Match</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-400 transition" />
              </Link>

              <Link
                href="/interview"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-slate-200">Mock Interview Session</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400 transition" />
              </Link>

              <Link
                href="/roadmap"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Map className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-200">Learning Roadmap</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-base font-semibold mb-4 text-slate-100">Activity Log</h2>
          <div className="space-y-2.5">
            {data?.recent_activity && data.recent_activity.length > 0 ? (
              data.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-300 flex items-center justify-between"
                >
                  <span>{activity}</span>
                  <span className="text-[11px] text-slate-400">Logged</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No activity recorded yet. Upload a resume or take a mock interview to populate your activity log.
              </div>
            )}
          </div>
        </Card>
      </PageContainer>
    </>
  );
}
