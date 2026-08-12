'use client';

import { useMemo, useState, useEffect } from 'react';
import { Award, BookOpen, Flame, Sparkles, Lightbulb } from 'lucide-react';
import type { Enrollment } from '../../lib/lms/types';
import { courses } from '../../lib/lms/data/courses';
import ProgressBar from './ProgressBar';
import { getAiRecommendations } from '../../lib/ai/client';
import Link from 'next/link';

type AiInsightsPanelProps = {
  enrollments: Enrollment[];
};

export default function AiInsightsPanel({ enrollments }: AiInsightsPanelProps) {
  const [recommendations, setRecommendations] = useState<{
    focusRecommendation: string;
    recommendedCourseIds: string[];
  } | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const enrollmentsData = enrollments.map(e => ({ courseId: e.courseId, progress: e.progress }));
        const availableCoursesData = courses.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category,
          level: c.level,
          tags: c.tags
        }));
        const data = await getAiRecommendations(enrollmentsData, availableCoursesData);
        if (!cancelled) {
          setRecommendations(data);
        }
      } catch (err) {
        console.error('Failed to load AI recommendations:', err);
      } finally {
        if (!cancelled) {
          setLoadingRecs(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [enrollments]);

  // Mock study metrics
  const stats = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.progress >= 100).length;
    const active = total - completed;
    const currentStreak = 4;
    
    const activeEnrollments = enrollments.filter((e) => e.progress > 0 && e.progress < 100);
    const primaryFocusEnrollment = activeEnrollments.sort((a, b) => a.progress - b.progress)[0] ?? null;
    const focusCourse = primaryFocusEnrollment 
      ? courses.find((c) => c.id === primaryFocusEnrollment.courseId) 
      : null;

    return {
      total,
      completed,
      active,
      currentStreak,
      focusCourse,
      focusEnrollment: primaryFocusEnrollment,
    };
  }, [enrollments]);

  const recommendedCourses = useMemo(() => {
    if (!recommendations?.recommendedCourseIds || recommendations.recommendedCourseIds.length === 0) {
      return courses.slice(0, 2);
    }
    return recommendations.recommendedCourseIds
      .map(id => courses.find(c => c.id === id))
      .filter((c): c is typeof courses[0] => !!c);
  }, [recommendations]);

  return (
    <div className="space-y-6">
      {/* Overview Analytics row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Streak card */}
        <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 flex items-center gap-4 shadow-soft">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Flame className="h-6 w-6 text-amber-500 fill-amber-500/20" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">Active Study Streak</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{stats.currentStreak} Days</p>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Keep it up to unlock reward badges!</span>
          </div>
        </div>

        {/* Finished certifications */}
        <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 flex items-center gap-4 shadow-soft">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Award className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">Certificates Earned</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{stats.completed} Verified</p>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Inspect on your progress tab.</span>
          </div>
        </div>

        {/* Ongoing learning paths */}
        <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 flex items-center gap-4 shadow-soft">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">Ongoing Courses</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{stats.active} Classes</p>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Syllabus modules in execution.</span>
          </div>
        </div>
      </div>

      {/* Focus & Recommendations Split */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Study focus recommendation */}
        <section className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 space-y-4 shadow-soft">
          <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-zinc-800 pb-3">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">AI Study Recommendation</span>
          </div>

          {loadingRecs ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500">
              <div className="h-6 w-6 rounded-full border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin mb-2" />
              <p className="text-xs">Analyzing study focus recommendations...</p>
            </div>
          ) : recommendations?.focusRecommendation ? (
            <div className="space-y-4 text-xs">
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {recommendations.focusRecommendation}
              </p>

              {stats.focusCourse && stats.focusEnrollment && (
                <div className="rounded-2xl border border-rose-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white">{stats.focusCourse.title}</span>
                    <span className="text-zinc-500 font-bold">{stats.focusEnrollment.progress}% done</span>
                  </div>
                  <ProgressBar value={stats.focusEnrollment.progress} size="sm" showLabel={false} />
                </div>
              )}

              {stats.focusCourse && (
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/learn/${stats.focusCourse.id}`}
                    className="rounded-full bg-zinc-900 dark:bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider !text-white dark:!text-zinc-900 hover:bg-black dark:hover:bg-zinc-100 transition shadow-sm"
                  >
                    Resume Course
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-6">
              You are caught up on all active study materials! Browse the catalog to start a new learning track.
            </p>
          )}
        </section>

        {/* Content Suggestions */}
        <section className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 space-y-4 shadow-soft">
          <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-zinc-800 pb-3">
            <Sparkles className="h-4 w-4 text-zinc-900 dark:text-white" />
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Recommended Courses</span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Based on your dynamic interest profile, we recommend adding these courses to your library:
          </p>

          {loadingRecs ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500">
              <div className="h-6 w-6 rounded-full border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin mb-2" />
              <p className="text-xs">Curating catalog recommendations...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-rose-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-center text-xs shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white truncate max-w-[200px]">{course.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{course.category} • {course.level}</p>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:underline shrink-0"
                  >
                    Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


