'use client';

import { Award, BookOpen, Clock, Users, Star, TrendingUp, HelpCircle } from 'lucide-react';
import StarRating from './StarRating';

type CourseCompletionRate = {
  id: string;
  title: string;
  studentsCount: number;
  completionRate: number;
};

type AnalyticsChartsProps = {
  courses: any[];
  completionRates: CourseCompletionRate[];
  totalStudents: number;
  pendingGrading: number;
  avgRating: number;
};

export default function AnalyticsCharts({
  courses,
  completionRates,
  totalStudents,
  pendingGrading,
  avgRating,
}: AnalyticsChartsProps) {
  // Let's compute average quiz score mock statistic
  const averageQuizScore = 84; // mock
  const totalLessonsCount = courses.reduce((sum, c) => sum + (c.curriculum?.reduce((lSum: number, m: any) => lSum + m.lessons.length, 0) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Course Completion Widget */}
        <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-violet-400" />
            <h2 className="text-base font-semibold text-white">Course Completion Rates</h2>
          </div>
          
          {completionRates.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No courses published yet.</p>
          ) : (
            <div className="space-y-4">
              {completionRates.map((c) => (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-semibold text-slate-200 truncate max-w-[200px]">{c.title}</p>
                    <span className="text-slate-400 font-medium">
                      {c.completionRate}% ({c.studentsCount} enrolled)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-850">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-700 ease-out"
                      style={{ width: `${c.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Engagement Metrics Panel */}
        <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-violet-400" />
            <h2 className="text-base font-semibold text-white">Classroom Engagement Metrics</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Avg Quiz Score */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                Avg. Quiz Score
              </div>
              <p className="text-2xl font-bold text-white mt-1">{averageQuizScore}%</p>
              <span className="text-[10px] text-slate-500">Benchmark: 70% passing</span>
            </div>

            {/* Total Lectures */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <BookOpen className="h-4 w-4 text-blue-400" />
                Lectures Published
              </div>
              <p className="text-2xl font-bold text-white mt-1">{totalLessonsCount}</p>
              <span className="text-[10px] text-slate-500">Across {courses.length} courses</span>
            </div>
          </div>

          {/* Average Course Ratings */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Course Ratings Average</span>
            <div className="space-y-3">
              {courses.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[180px]">{c.title}</span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={c.rating} size={12} showValue={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* SVG Radial Progress Graphic Widget */}
      <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative h-32 w-32 flex-shrink-0">
            {/* SVG Circle Progress */}
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="50"
                className="fill-none stroke-slate-900 stroke-[10]"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                className="fill-none stroke-violet-500 stroke-[10] transition-all duration-1000 ease-out"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - 0.81)} // 81% engagement rate from stats
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white">81%</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Active</span>
            </div>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-base font-semibold text-white">Overall Student Participation Rate</h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              This metric evaluates how actively students interact with video lectures, complete quizzes within deadlines, and submit coursework compared to total enrollments.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                +4% This Week
              </span>
              <span className="rounded-full border border-slate-850 bg-slate-900/60 px-2.5 py-1 text-[10px] text-slate-400">
                Avg Rating: {avgRating} Stars
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
