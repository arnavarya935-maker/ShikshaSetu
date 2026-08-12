'use client';

import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import AnalyticsCharts from '../../../../components/lms/AnalyticsCharts';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useTeacherAnalytics, useTeacherCourses } from '../../../../lib/lms/hooks-teacher';

export default function EducatorAnalyticsPage() {
  const { user } = useAuth();
  const { courses } = useTeacherCourses(user?.uid);
  const { stats, courseCompletionRates, loading } = useTeacherAnalytics(user?.uid);

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Classroom Performance Analytics"
        subtitle="Review student engagement levels, average ratings, and module completions."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Analytics' }]}
      >
        {loading ? (
          <LmsSkeletonLoader type="lessonContent" />
        ) : (
          <AnalyticsCharts
            courses={courses}
            completionRates={courseCompletionRates}
            totalStudents={stats.totalStudents}
            pendingGrading={stats.pendingGrading}
            avgRating={stats.avgRating}
          />
        )}
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
