'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Award, BookOpen, TrendingUp, Flame } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import DashboardStatCard from '../../../../components/DashboardStatCard';
import ProgressBar from '../../../../components/lms/ProgressBar';
import CertificateCard from '../../../../components/lms/CertificateCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useEnrollments, useCertificates } from '../../../../lib/lms/hooks';
import { courses } from '../../../../lib/lms/data/courses';

export default function ProgressPage() {
  const { user } = useAuth();
  const { enrollments, loading: enrollLoading } = useEnrollments(user?.uid);
  const { certificates, loading: certLoading } = useCertificates(user?.uid);

  const loading = enrollLoading || certLoading;

  const stats = useMemo(() => {
    const totalCourses = enrollments.length;
    const completed = enrollments.filter((e) => e.progress >= 100).length;
    const avgProgress = totalCourses > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;
    const totalLessonsCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);

    return { totalCourses, completed, avgProgress, totalLessonsCompleted };
  }, [enrollments]);

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="Progress"
        subtitle="Track your learning progress across all enrolled courses."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Progress' },
        ]}
      >
        {loading ? (
          <LmsSkeletonLoader type="courseGrid" count={4} />
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardStatCard label="Enrolled courses" value={String(stats.totalCourses)} subtext="Total enrollments" />
              <DashboardStatCard label="Completed" value={String(stats.completed)} subtext="Courses finished" />
              <DashboardStatCard label="Avg. progress" value={`${stats.avgProgress}%`} subtext="Across all courses" />
              <DashboardStatCard label="Lessons completed" value={String(stats.totalLessonsCompleted)} subtext="Total lessons done" />
            </div>

            {/* Per-course progress */}
            <DashboardCard title="Course Progress" description="Detailed progress for each enrolled course.">
              {enrollments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  No courses enrolled yet.{' '}
                  <Link href="/courses" className="text-violet-400 hover:text-violet-300 transition">
                    Explore courses →
                  </Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => {
                    const course = courses.find((c) => c.id === enrollment.courseId);
                    if (!course) return null;

                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-[1.5rem] border border-slate-800/70 bg-slate-900/60 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{course.category}</p>
                            <Link
                              href={`/learn/${course.id}`}
                              className="mt-1 block text-base font-semibold text-white hover:text-violet-200 transition truncate"
                            >
                              {course.title}
                            </Link>
                            <p className="mt-1 text-sm text-slate-400">{course.instructor.name}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {enrollment.progress >= 100 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                                <Award className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300">
                                {enrollment.progress}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <ProgressBar value={enrollment.progress} size="sm" showLabel={false} />
                          <p className="mt-2 text-xs text-slate-500">
                            {enrollment.completedLessons.length} lessons completed
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DashboardCard>

            {/* Certificates */}
            {certificates.length > 0 && (
              <DashboardCard title="Certificates Earned" description="Your achievement certificates.">
                <div className="grid gap-6 lg:grid-cols-2">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="rounded-[1.5rem] border border-slate-800/70 bg-slate-900/60 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
                          <Award className="h-5 w-5 text-violet-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{cert.courseName}</p>
                          <p className="text-xs text-slate-500">Certificate #{cert.certificateNumber}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          Earned {new Date(cert.earnedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        <Link
                          href={`/learn/${cert.courseId}/certificate`}
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}
          </div>
        )}
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
