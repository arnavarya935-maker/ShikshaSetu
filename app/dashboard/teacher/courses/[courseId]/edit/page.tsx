'use client';

import { useParams, useRouter } from 'next/navigation';
import RoleProtectedRoute from '../../../../../../components/RoleProtectedRoute';
import CourseEditor from '../../../../../../components/lms/CourseEditor';
import LmsSkeletonLoader from '../../../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../../../components/AuthProvider';
import { useTeacherCourses } from '../../../../../../lib/lms/hooks-teacher';
import type { Course } from '../../../../../../lib/lms/types';
import { useMemo } from 'react';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';

  const { user } = useAuth();
  const { courses, loading, update, remove } = useTeacherCourses(user?.uid);

  const course = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);

  const handleSave = async (courseData: Partial<Course>) => {
    await update(courseId, courseData);
  };

  const handleDelete = async () => {
    await remove(courseId);
    router.push('/dashboard/teacher/courses');
  };

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <main className="min-h-screen bg-slate-950 p-6">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <LmsSkeletonLoader type="lessonContent" />
          ) : !course ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold text-white">Course Not Found</h2>
              <p className="text-sm text-slate-400 mt-2">The course you are trying to edit does not exist or you do not have permission.</p>
            </div>
          ) : (
            <CourseEditor
              titleText={`Edit Course: ${course.title}`}
              initialCourse={course}
              onSave={handleSave}
              onDelete={handleDelete}
              isNew={false}
            />
          )}
        </div>
      </main>
    </RoleProtectedRoute>
  );
}
