'use client';

import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import EnrolledCourseCard from '../../../../components/lms/EnrolledCourseCard';
import EmptyState from '../../../../components/EmptyState';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useEnrollments } from '../../../../lib/lms/hooks';
import { useRouter } from 'next/navigation';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollments(user?.uid);
  const router = useRouter();

  const activeCourses = enrollments.filter((e) => e.progress < 100);
  const completedCourses = enrollments.filter((e) => e.progress >= 100);

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="My Courses"
        subtitle="Browse and continue the courses you are enrolled in."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'My Courses' },
        ]}
      >
        {loading ? (
          <LmsSkeletonLoader type="courseGrid" count={3} />
        ) : enrollments.length === 0 ? (
          <EmptyState
            title="No courses yet"
            description="You haven't enrolled in any courses. Explore the catalog to start learning!"
            actionLabel="Explore Courses"
            onAction={() => router.push('/courses')}
          />
        ) : (
          <div className="space-y-8">
            {/* In Progress */}
            {activeCourses.length > 0 && (
              <DashboardCard
                title="In Progress"
                description={`${activeCourses.length} course${activeCourses.length !== 1 ? 's' : ''} in progress`}
              >
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {activeCourses.map((enrollment) => (
                    <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              </DashboardCard>
            )}

            {/* Completed */}
            {completedCourses.length > 0 && (
              <DashboardCard
                title="Completed"
                description={`${completedCourses.length} course${completedCourses.length !== 1 ? 's' : ''} completed`}
              >
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {completedCourses.map((enrollment) => (
                    <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
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
