'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../components/AuthProvider';
import { useCourse, useEnrollment } from '../../../lib/lms/hooks';
import { getNextLesson, getAllLessons } from '../../../lib/lms/utils';

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  const { user } = useAuth();
  const { course } = useCourse(courseId);
  const { enrollment, loading } = useEnrollment(user?.uid, courseId);

  useEffect(() => {
    if (loading || !course) return;

    if (enrollment) {
      // Go to current lesson or next uncompleted lesson
      const nextLesson = getNextLesson(course.curriculum, enrollment.completedLessons);
      const targetLessonId = nextLesson?.id ?? enrollment.currentLessonId;
      if (targetLessonId) {
        router.replace(`/learn/${courseId}/lesson/${targetLessonId}`);
        return;
      }
    }

    // Not enrolled or no curriculum — go to first lesson
    const allLessons = getAllLessons(course.curriculum);
    if (allLessons.length > 0) {
      router.replace(`/learn/${courseId}/lesson/${allLessons[0].id}`);
    } else {
      router.replace(`/courses/${course.slug}`);
    }
  }, [loading, course, enrollment, courseId, router]);

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
          <p className="mt-4 text-sm text-slate-400">Loading your lesson...</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
