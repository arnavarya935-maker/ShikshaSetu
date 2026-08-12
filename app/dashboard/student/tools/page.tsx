'use client';

import { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, GraduationCap, FileText, CalendarDays, BarChart2 } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import AiTutorPanel from '../../../../components/lms/AiTutorPanel';
import AiQuizGenerator from '../../../../components/lms/AiQuizGenerator';
import AiSummaryGenerator from '../../../../components/lms/AiSummaryGenerator';
import AiStudyPlanner from '../../../../components/lms/AiStudyPlanner';
import AiInsightsPanel from '../../../../components/lms/AiInsightsPanel';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useEnrollments } from '../../../../lib/lms/hooks';

type ToolTab = 'tutor' | 'quiz' | 'summary' | 'planner' | 'insights';

export default function StudyToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('tutor');
  const { user } = useAuth();
  
  // Fetch active student enrollments for insights panel context
  const { enrollments, loading } = useEnrollments(user?.uid);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['tutor', 'quiz', 'summary', 'planner', 'insights'].includes(tab)) {
        setActiveTab(tab as ToolTab);
      }
    }
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="AI Study Tools Workspace"
        subtitle="Leverage educational AI utilities to summarize notes, solve doubts, generate quizzes, and plan schedules."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/student' }, { label: 'Study Tools' }]}
      >
        <div className="space-y-6">
          {/* Navigation tabs */}
          <div className="flex flex-wrap border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'tutor' 
                  ? 'border-b-2 border-violet-500 text-violet-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              AI Tutor Chat
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'quiz' 
                  ? 'border-b-2 border-violet-500 text-violet-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              Quiz Generator
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'summary' 
                  ? 'border-b-2 border-violet-500 text-violet-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              Notes Summarizer
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'planner' 
                  ? 'border-b-2 border-violet-500 text-violet-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Weekly Planner
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'insights' 
                  ? 'border-b-2 border-violet-500 text-violet-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              AI Insights
            </button>
          </div>

          {/* Tab contents */}
          <div className="pt-2">
            {activeTab === 'tutor' && <AiTutorPanel />}
            {activeTab === 'quiz' && <AiQuizGenerator />}
            {activeTab === 'summary' && <AiSummaryGenerator />}
            {activeTab === 'planner' && <AiStudyPlanner />}
            {activeTab === 'insights' && (
              loading ? (
                <LmsSkeletonLoader type="sidebar" />
              ) : (
                <AiInsightsPanel enrollments={enrollments} />
              )
            )}
          </div>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
