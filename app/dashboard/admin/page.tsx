'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Users, BookOpen, AlertTriangle, ShieldAlert, Award, Settings, CheckCircle2, Server, Activity } from 'lucide-react';
import RoleProtectedRoute from '../../../components/RoleProtectedRoute';
import DashboardShell from '../../../components/DashboardShell';
import DashboardCard from '../../../components/DashboardCard';
import DashboardStatCard from '../../../components/DashboardStatCard';
import LmsSkeletonLoader from '../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../components/AuthProvider';
import { useAdminAnalytics, useAdminIssues } from '../../../lib/lms/hooks-admin';
import { formatDate } from '../../../lib/lms/utils';
import UserProfileCard from '../../../components/UserProfileCard';


export default function AdminDashboardPage() {
  const { profile } = useAuth();
  
  // Load admin hooks
  const { stats, usersRoleRatio, loading } = useAdminAnalytics();
  const { issues, resolveIssue } = useAdminIssues();

  const openIssuesList = useMemo(() => {
    return issues.filter((i) => i.status === 'open').slice(0, 3);
  }, [issues]);

  const statCards = useMemo(
    () => [
      { label: 'Total users', value: String(stats.totalUsers), subtext: 'Active accounts across roles' },
      { label: 'Teachers onboarded', value: String(stats.teachersCount), subtext: 'Verified instructors' },
      { label: 'Courses live', value: String(stats.coursesCount), subtext: 'Published learning paths' },
      { label: 'Platform health', value: stats.platformHealth, subtext: `${stats.openIssues} unresolved reports` },
    ],
    [stats]
  );

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Admin Control Center"
        subtitle="Monitor users, courses, platform health, and tickets."
        breadcrumbs={[{ label: 'Dashboard' }]}
      >
        {loading ? (
          <LmsSkeletonLoader type="lessonContent" />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((item) => (
                  <DashboardStatCard key={item.label} label={item.label} value={item.value} subtext={item.subtext} />
                ))}
              </div>

              {/* Support issues / Troubleshooting queue */}
              <DashboardCard
                title="Platform Support & Alerts"
                description="Reported technical errors or customer support requests."
              >
                {openIssuesList.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    No unresolved support tickets. Everything is running smoothly!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openIssuesList.map((issue) => (
                      <div
                        key={issue.id}
                        className={`rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-4 pl-5 space-y-3 text-xs border-l-4 ${
                          issue.severity === 'high' 
                            ? 'border-l-rose-500' 
                            : issue.severity === 'medium'
                            ? 'border-l-amber-500'
                            : 'border-l-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              issue.severity === 'high' 
                                ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300' 
                                : issue.severity === 'medium'
                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                                : 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300'
                            }`}>
                              {issue.severity} priority
                            </span>
                            <h4 className="text-sm font-bold text-slate-905 dark:text-white mt-1.5">{issue.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 mt-1.5 leading-normal">{issue.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => resolveIssue(issue.id)}
                            className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 px-3 py-1.5 text-[10px] font-bold hover:bg-emerald-500/25 dark:hover:bg-emerald-500/25 transition flex-shrink-0"
                          >
                            Mark Resolved
                          </button>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 text-slate-500 flex items-center justify-between">
                          <span>Reported by: <span className="font-semibold text-slate-700 dark:text-slate-400">{issue.reporterName}</span></span>
                          <span>{formatDate(issue.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DashboardCard>

              {/* Quick Actions Panel */}
              <DashboardCard
                title="Administrative Tools"
                description="Common platform operations you can complete right now."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/dashboard/admin/users"
                    className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-soft group"
                  >
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Audit User Roles</p>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">View and change credentials for students and instructors.</p>
                  </Link>

                  <Link
                    href="/dashboard/admin/courses"
                    className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-soft group"
                  >
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Manage Course Catalog</p>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Review, search, and delete courses across all educators.</p>
                  </Link>

                  <Link
                    href="/dashboard/admin/analytics"
                    className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-soft group"
                  >
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Platform Analytics</p>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Inspect demographic splits and student ratios.</p>
                  </Link>

                  <Link
                    href="/dashboard/admin/settings"
                    className="rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-soft group"
                  >
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Platform Settings</p>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Manage hosting settings and diagnostic integrations.</p>
                  </Link>
                </div>
              </DashboardCard>
            </div>

            {/* Right hand columns */}
            <div className="space-y-6">
              {/* Enterprise User Profile Card */}
              <UserProfileCard className="mx-auto" />

              {/* User Roles ratio Widget */}
              <DashboardCard

                title="User Demographics"
                description="Percentage ratio of platform registrations."
              >
                <div className="space-y-4 pt-2 text-xs">
                  {/* Students */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600 dark:text-slate-350">Students</span>
                      <span className="font-bold text-slate-800 dark:text-white">{usersRoleRatio.students}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${usersRoleRatio.students}%` }} />
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600 dark:text-slate-350">Instructors</span>
                      <span className="font-bold text-slate-800 dark:text-white">{usersRoleRatio.teachers}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400" style={{ width: `${usersRoleRatio.teachers}%` }} />
                    </div>
                  </div>

                  {/* Admins */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600 dark:text-slate-350">Platform Admins</span>
                      <span className="font-bold text-slate-800 dark:text-white">{usersRoleRatio.admins}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${usersRoleRatio.admins}%` }} />
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Diagnostis card */}
              <DashboardCard
                title="System Diagnostics"
                description="Hosting services and database check logs."
              >
                <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                      <Server className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      App Firestore Database
                    </span>
                    <span className="font-semibold text-emerald-500 dark:text-emerald-450">ONLINE</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                      <Activity className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      API Latency
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-white">42ms (Stable)</span>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        )}
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
