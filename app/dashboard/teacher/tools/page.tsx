'use client';

import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import Link from 'next/link';
import { BookOpen, ClipboardList, CalendarDays, BarChart3, User, Settings } from 'lucide-react';

export default function TeacherToolsPage() {
  const toolsList = [
    {
      title: 'Course Studio',
      description: 'Manage class listings, publish topics, and construct modules/lessons.',
      href: '/dashboard/teacher/courses',
      icon: BookOpen,
      action: 'Manage Courses',
    },
    {
      title: 'Grading Studio',
      description: 'Review student homework assignments, log quiz grades, and provide feedback.',
      href: '/dashboard/teacher/assignments',
      icon: ClipboardList,
      action: 'Grade Tasks',
    },
    {
      title: 'Study Calendar Planner',
      description: 'Schedule lectures, allocate exam preps, and publish student announcements.',
      href: '/dashboard/teacher/schedule',
      icon: CalendarDays,
      action: 'Configure Planner',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Monitor rating metrics, course completions, and student streaks.',
      href: '/dashboard/teacher/analytics',
      icon: BarChart3,
      action: 'Inspect Analytics',
    },
  ];

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Instructor Workspace Tools"
        subtitle="Quick access hubs to manage your classes, evaluations, calendars, and student feedback."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Study Tools' }]}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <DashboardCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
              >
                <div className="pt-2 flex justify-between items-center text-xs">
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-300">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <Link
                    href={tool.href}
                    className="rounded-full bg-slate-900 border border-slate-800 px-4 py-2 font-semibold text-violet-300 hover:text-white hover:border-violet-500 transition"
                  >
                    {tool.action} →
                  </Link>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
