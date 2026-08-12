'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import EmptyState from '../../../../components/EmptyState';
import { useAuth } from '../../../../components/AuthProvider';
import { useEnrollments } from '../../../../lib/lms/hooks';
import { courses } from '../../../../lib/lms/data/courses';
import { CheckCircle2, Circle, Lock, Play, Sparkles, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningPathPage() {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollments(user?.uid);
  const router = useRouter();

  // Selected course ID state for path selector
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Find enrolled course details
  const enrolledCourses = useMemo(() => {
    return enrollments
      .map((e) => {
        const course = courses.find((c) => c.id === e.courseId);
        if (!course) return null;
        return {
          ...course,
          enrollment: e,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [enrollments]);

  // Set default selected course once loaded
  useMemo(() => {
    if (enrolledCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(enrolledCourses[0].id);
    }
  }, [enrolledCourses, selectedCourseId]);

  // Get active path details
  const activePath = useMemo(() => {
    return enrolledCourses.find((c) => c.id === selectedCourseId) || null;
  }, [enrolledCourses, selectedCourseId]);

  // Flattened lessons list with completion and lock states
  const pathSteps = useMemo(() => {
    if (!activePath) return [];

    const list: any[] = [];
    const completedSet = new Set(activePath.enrollment.completedLessons);
    let reachedCurrent = false;

    activePath.curriculum.forEach((mod, modIdx) => {
      mod.lessons.forEach((lesson, lesIdx) => {
        const isCompleted = completedSet.has(lesson.id);
        let isCurrent = false;

        if (!isCompleted && !reachedCurrent) {
          isCurrent = true;
          reachedCurrent = true;
        }

        const isLocked = !isCompleted && !isCurrent && reachedCurrent;

        list.push({
          ...lesson,
          moduleTitle: mod.title,
          isCompleted,
          isCurrent,
          isLocked: isLocked || (!isCompleted && !isCurrent && !reachedCurrent), // Fallback safety
          stepNumber: list.length + 1,
        });
      });
    });

    // If all lessons are completed, mark none as current
    return list;
  }, [activePath]);

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="Learning Path"
        subtitle="Visual timeline roadmap of your course requirements and milestones."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Learning Path' }
        ]}
      >
        {loading ? (
          <LmsSkeletonLoader type="lessonContent" />
        ) : enrolledCourses.length === 0 ? (
          <EmptyState
            title="No paths generated yet"
            description="You aren't enrolled in any courses to trace a learning path. Start by exploring the course catalog!"
            actionLabel="Explore Courses"
            onAction={() => router.push('/courses')}
          />
        ) : (
          <div className="space-y-6">
            {/* Path Selector Tab Bar */}
            <div className="flex flex-wrap gap-2.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-soft">
              {enrolledCourses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    selectedCourseId === c.id
                      ? 'bg-violet-500 text-white shadow-soft'
                      : 'bg-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            {activePath && (
              <div className="grid gap-6 md:grid-cols-[1fr_2.5fr]">
                {/* Course Path Progress Summary */}
                <div className="rounded-3xl border border-slate-850 bg-slate-950/85 p-6 flex flex-col justify-between shadow-soft h-fit sticky top-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">
                      {activePath.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 leading-snug">{activePath.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Instructor: {activePath.instructor.name}</p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Overall Progress</span>
                          <span>{activePath.enrollment.progress}%</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            style={{ width: `${activePath.enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Completed steps</span>
                        <span>{activePath.enrollment.completedLessons.length} / {pathSteps.length}</span>
                      </div>
                    </div>
                  </div>

                  {activePath.enrollment.progress >= 100 ? (
                    <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col items-center text-center">
                      <Award className="h-10 w-10 text-emerald-400 animate-bounce" />
                      <p className="text-sm font-bold text-emerald-300 mt-2">Course Completed!</p>
                      <Link
                        href={`/learn/${activePath.id}/certificate`}
                        className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition"
                      >
                        Claim Certificate <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push(`/learn/${activePath.id}`)}
                      className="mt-8 w-full rounded-2xl bg-violet-500 py-3 text-xs font-bold text-white shadow-soft hover:bg-violet-400 transition"
                    >
                      Resume Path
                    </button>
                  )}
                </div>

                {/* Timeline Path Steps */}
                <DashboardCard title="Learning Timeline" description="Trace your custom step-by-step milestone path.">
                  <div className="relative border-l border-slate-800 ml-5 py-2 space-y-8">
                    {pathSteps.map((step, index) => {
                      const isCompleted = step.isCompleted;
                      const isCurrent = step.isCurrent;
                      const isLocked = step.isLocked;

                      return (
                        <div key={step.id} className="relative pl-8 group">
                          {/* Timeline node icon */}
                          <div className="absolute -left-[13px] top-1 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-slate-950 border z-10 transition-all duration-300">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : isCurrent ? (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 border border-violet-500"
                              >
                                <Circle className="h-2 w-2 fill-violet-400 text-violet-400" />
                              </motion.div>
                            ) : (
                              <Lock className="h-3 w-3 text-slate-650" />
                            )}
                          </div>

                          {/* Node Card */}
                          <motion.div
                            whileHover={isLocked ? undefined : { x: 4 }}
                            className={`rounded-2xl border p-4 shadow-soft transition-all duration-200 ${
                              isCurrent
                                ? 'border-violet-500 bg-slate-900/50 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.15)]'
                                : isLocked
                                ? 'border-slate-900 bg-slate-950/20 opacity-55'
                                : 'border-slate-850 bg-slate-950/50 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-500">
                                  Step {step.stepNumber} — {step.moduleTitle}
                                </span>
                                <h4 className="text-sm font-bold text-white mt-0.5">{step.title}</h4>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full">
                                  {step.type}
                                </span>

                                {isCurrent && (
                                  <Link
                                    href={`/learn/${activePath.id}/lesson/${step.id}`}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-white shadow-soft hover:bg-violet-400 transition"
                                  >
                                    <Play className="h-3 w-3 fill-white ml-0.5" />
                                  </Link>
                                )}
                              </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-400 leading-relaxed truncate max-w-2xl">{step.content}</p>

                            {step.duration && (
                              <p className="mt-3 text-[10px] text-slate-500 font-semibold">Duration: {step.duration} min</p>
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </DashboardCard>
              </div>
            )}
          </div>
        )}
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
