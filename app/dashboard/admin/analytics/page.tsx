'use client';

import { useMemo } from 'react';
import { Award, BookOpen, Clock, Users, ShieldAlert, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import DashboardStatCard from '../../../../components/DashboardStatCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAdminAnalytics } from '../../../../lib/lms/hooks-admin';

export default function AdminAnalyticsPage() {
  const { stats, usersRoleRatio, loading } = useAdminAnalytics();

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Platform Audit & Analytics"
        subtitle="Review platform-wide system health, user growths, and diagnostic scores."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Analytics' }]}
      >
        {loading ? (
          <LmsSkeletonLoader type="lessonContent" />
        ) : (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardStatCard label="Total platform users" value={String(stats.totalUsers)} subtext="Active registrations" />
              <DashboardStatCard label="Instructors" value={String(stats.teachersCount)} subtext="Certified creators" />
              <DashboardStatCard label="Students roster" value={String(stats.studentsCount)} subtext="Enrolled learners" />
              <DashboardStatCard label="Courses hosted" value={String(stats.coursesCount)} subtext="Live learning catalog" />
            </div>

            {/* Demographics breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard
                title="User Demographics Split"
                description="Percentage breakdown of credentials on ShikshaSetu."
              >
                <div className="space-y-4 pt-2 text-xs">
                  {/* Students */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Students</span>
                      <span className="font-bold text-white">{usersRoleRatio.students}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-violet-500 transition-all duration-700 ease-out" style={{ width: `${usersRoleRatio.students}%` }} />
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Instructors</span>
                      <span className="font-bold text-white">{usersRoleRatio.teachers}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-fuchsia-500 transition-all duration-700 ease-out" style={{ width: `${usersRoleRatio.teachers}%` }} />
                    </div>
                  </div>

                  {/* Admins */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Platform Admins</span>
                      <span className="font-bold text-white">{usersRoleRatio.admins}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${usersRoleRatio.admins}%` }} />
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Troubleshooting statistics */}
              <DashboardCard
                title="Support Ticket Metrics"
                description="Analysis of reported customer platform warnings."
              >
                <div className="space-y-4 pt-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">Total reported tickets</span>
                    <span className="font-bold text-white">3 logs</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">Unresolved support alerts</span>
                    <span className={`font-bold ${stats.openIssues > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {stats.openIssues} open
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">System health index</span>
                    <span className="font-bold text-emerald-400">99.8% Uptime</span>
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
