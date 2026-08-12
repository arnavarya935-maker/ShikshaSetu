'use client';

import { useState } from 'react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import GradingPanel from '../../../../components/lms/GradingPanel';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useCourseSubmissions, useTeacherCourses } from '../../../../lib/lms/hooks-teacher';

export default function EducatorGradingPage() {
  const { user } = useAuth();
  const { courses } = useTeacherCourses(user?.uid);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  
  // Custom hooks for assignment submissions
  const { submissions, loading, grade } = useCourseSubmissions(
    selectedCourseId === 'all' ? undefined : selectedCourseId
  );

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Grading Studio"
        subtitle="Assess student assignment submissions, score points, and write annotations."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Assignments' }]}
      >
        <div className="space-y-6">
          {/* Header filter dropdown */}
          <div className="flex justify-end">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              <option value="all">Grade All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submissions interactive grading dashboard */}
          {loading ? (
            <LmsSkeletonLoader type="lessonContent" />
          ) : (
            <GradingPanel
              submissions={submissions}
              onGrade={grade}
            />
          )}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
