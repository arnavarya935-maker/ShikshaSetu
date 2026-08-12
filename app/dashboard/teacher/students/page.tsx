'use client';

import { useMemo, useState } from 'react';
import { Award, BookOpen, Clock, Users, Search, Filter } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import ProgressBar from '../../../../components/lms/ProgressBar';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useTeacherAnalytics, useTeacherCourses } from '../../../../lib/lms/hooks-teacher';
import { formatDate } from '../../../../lib/lms/utils';

export default function StudentTrackingPage() {
  const { user } = useAuth();
  const { courses } = useTeacherCourses(user?.uid);
  const { enrollmentList, loading } = useTeacherAnalytics(user?.uid);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    return enrollmentList.filter((e) => {
      const matchesSearch =
        e.studentName.toLowerCase().includes(search.toLowerCase()) ||
        e.studentEmail.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = courseFilter === 'all' || e.courseId === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [enrollmentList, search, courseFilter]);

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Student Progress & Performance"
        subtitle="Monitor user engagement, lesson completions, and certificates issued."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Students' }]}
      >
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-650 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="rounded-xl border border-slate-850 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
              >
                <option value="all">All Enrolled Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student list grid */}
          {loading ? (
            <LmsSkeletonLoader type="courseGrid" count={3} />
          ) : (
            <DashboardCard
              title="Class Rosters"
              description={`Currently tracking ${filteredStudents.length} student registrations.`}
            >
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No students found matching your criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">Student Profile</th>
                        <th className="py-3 px-4">Enrolled Course</th>
                        <th className="py-3 px-4">Study Progress</th>
                        <th className="py-3 px-4">Enrollment Date</th>
                        <th className="py-3 px-4 text-right">Credentials</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-xs text-slate-300">
                      {filteredStudents.map((e, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/20">
                          <td className="py-4 px-4 font-semibold text-white">
                            <p>{e.studentName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{e.studentEmail}</p>
                          </td>
                          <td className="py-4 px-4 truncate max-w-[200px]">
                            {e.courseTitle}
                          </td>
                          <td className="py-4 px-4 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200">{e.progress}%</span>
                              <div className="w-24">
                                <ProgressBar value={e.progress} size="sm" showLabel={false} />
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {e.completedCount} / {e.totalLessons} lessons finished
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-650" />
                              {formatDate(e.enrolledAt)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {e.certificateEarned ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                <Award className="h-3 w-3" />
                                CERTIFICATE ISSUED
                              </span>
                            ) : (
                              <span className="text-slate-600 font-medium text-[10px]">IN PROGRESS</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardCard>
          )}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
