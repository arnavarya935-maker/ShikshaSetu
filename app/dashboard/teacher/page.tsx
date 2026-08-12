'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Plus, Award, BarChart3, CalendarDays, Megaphone, Star, Users, ClipboardList } from 'lucide-react';
import RoleProtectedRoute from '../../../components/RoleProtectedRoute';
import DashboardShell from '../../../components/DashboardShell';
import DashboardCard from '../../../components/DashboardCard';
import DashboardStatCard from '../../../components/DashboardStatCard';
import DashboardActions from '../../../components/DashboardActions';
import { useAuth } from '../../../components/AuthProvider';
import { useTeacherAnalytics, useCourseSubmissions } from '../../../lib/lms/hooks-teacher';
import { formatDate } from '../../../lib/lms/utils';
import MiniCalendar from '../../../components/lms/MiniCalendar';
import UserProfileCard from '../../../components/UserProfileCard';


export default function TeacherDashboardPage() {
  const { profile, user } = useAuth();
  
  // Custom teacher analytics hooks
  const { stats, loading, enrollmentList } = useTeacherAnalytics(user?.uid);
  const { submissions } = useCourseSubmissions();

  const dynamicStats = useMemo(
    () => [
      { label: 'Active classes', value: String(stats.activeClasses), subtext: 'Courses currently teaching' },
      { label: 'Total Students', value: String(stats.totalStudents), subtext: 'Enrolled in your courses' },
      { label: 'Assignments to grade', value: String(stats.pendingGrading), subtext: 'Pending student work' },
      { label: 'Instructor Rating', value: `${stats.avgRating} / 5`, subtext: 'Average course score' },
    ],
    [stats]
  );

  const pendingSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === 'ungraded').slice(0, 3);
  }, [submissions]);

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Teacher Dashboard"
        subtitle="Manage your classroom, assignments, and analytics."
        breadcrumbs={[{ label: 'Dashboard' }]}
      >
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              {dynamicStats.map((stat) => (
                <DashboardStatCard key={stat.label} label={stat.label} value={stat.value} subtext={stat.subtext} />
              ))}
            </div>

            {/* Quick Actions */}
            <DashboardCard title="Quick actions" description="Common instructor workflows you can start right away.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard/teacher/courses/new"
                  className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 group"
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                    <Plus className="h-4 w-4" />
                    Create course
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Launch a new class or curriculum block.</p>
                </Link>

                <Link
                  href="/dashboard/teacher/assignments"
                  className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 group"
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                    <ClipboardList className="h-4 w-4" />
                    Grade assignments
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Review, grade, and feedback student submissions.</p>
                </Link>

                <Link
                  href="/dashboard/teacher/schedule"
                  className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 group"
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                    <Megaphone className="h-4 w-4" />
                    Post announcement
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Broadcast notices and links to your students.</p>
                </Link>

                <Link
                  href="/dashboard/teacher/analytics"
                  className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 group"
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                    <BarChart3 className="h-4 w-4" />
                    View performance
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Analyze course completions and scores.</p>
                </Link>
              </div>
            </DashboardCard>

            {/* Submissions queue activity */}
            <DashboardCard title="Grading Queue (Recent Submissions)" description="Pending student work awaiting evaluations.">
              {pendingSubmissions.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">All caught up! No ungraded assignments.</p>
              ) : (
                <ul className="space-y-4">
                  {pendingSubmissions.map((sub) => (
                    <li key={sub.id} className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-4 border-l-4 border-l-pink-500 pl-5 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-450 dark:text-slate-500">{sub.courseTitle}</p>
                        <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{sub.assignmentTitle}</p>
                        <p className="mt-1 text-xs text-slate-550 dark:text-slate-400">Submitted by: <span className="font-medium text-slate-800 dark:text-white">{sub.studentName}</span> • {formatDate(sub.submittedAt)}</p>
                      </div>
                      <Link
                        href="/dashboard/teacher/assignments"
                        className="flex-shrink-0 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
                      >
                        Grade Now →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardCard>
          </div>

          {/* Right hand details cards */}
          <div className="space-y-6">
            {/* Enterprise User Profile Card */}
            <UserProfileCard className="mx-auto" />


            <DashboardCard title="Calendar Study scheduler" description="Upcoming deadlines and lecture scheduling.">
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  <span>2 office hours sessions scheduled this week.</span>
                </div>
                <MiniCalendar highlightedDays={[10, 18]} />
                <Link
                  href="/dashboard/teacher/schedule"
                  className="block text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-white hover:border-indigo-400 transition"
                >
                  Configure study calendar
                </Link>
              </div>
            </DashboardCard>
          </div>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
