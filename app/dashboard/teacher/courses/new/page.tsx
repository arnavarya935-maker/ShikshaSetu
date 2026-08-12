'use client';

import { useRouter } from 'next/navigation';
import RoleProtectedRoute from '../../../../../components/RoleProtectedRoute';
import CourseEditor from '../../../../../components/lms/CourseEditor';
import { useAuth } from '../../../../../components/AuthProvider';
import { useTeacherCourses } from '../../../../../lib/lms/hooks-teacher';
import type { Course } from '../../../../../lib/lms/types';

export default function NewCoursePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create } = useTeacherCourses(user?.uid);

  const handleSave = async (courseData: Partial<Course>) => {
    // Populate teacher info automatically
    const detailedData = {
      ...courseData,
      instructor: {
        name: profile?.name ?? user?.displayName ?? 'Instructor',
        avatar: (profile?.name ?? user?.displayName ?? 'INS').slice(0, 2).toUpperCase(),
        bio: 'Educator at ' + (profile?.institute ?? 'ShikshaSetu'),
        title: 'Course Instructor',
      },
    };

    const newCourse = await create(detailedData);
    if (newCourse) {
      router.push('/dashboard/teacher/courses');
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <main className="min-h-screen bg-slate-950 p-6">
        <div className="mx-auto max-w-5xl">
          <CourseEditor
            titleText="Create New Course"
            onSave={handleSave}
            isNew={true}
          />
        </div>
      </main>
    </RoleProtectedRoute>
  );
}
