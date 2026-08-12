'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import LessonContent from '../../../../../components/lms/LessonContent';
import LessonSidebar from '../../../../../components/lms/LessonSidebar';
import BookmarkButton from '../../../../../components/lms/BookmarkButton';
import ProgressBar from '../../../../../components/lms/ProgressBar';
import LmsSkeletonLoader from '../../../../../components/lms/LmsSkeletonLoader';
import LessonDiscussions from '../../../../../components/lms/LessonDiscussions';
import { useAuth } from '../../../../../components/AuthProvider';
import { useCourse, useEnrollment, useNotes, useBookmarks } from '../../../../../lib/lms/hooks';
import { getLessonById, getAdjacentLessons, getTotalLessons } from '../../../../../lib/lms/utils';
import { updateLessonProgress, saveNote, deleteNote, toggleBookmark, submitAssignment as submitAssignmentFn } from '../../../../../lib/lms/firestore';

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  const lessonId = typeof params.lessonId === 'string' ? params.lessonId : '';
  const { user, profile } = useAuth();
  const { course, loading: courseLoading } = useCourse(courseId);
  const { enrollment, setEnrollment } = useEnrollment(user?.uid, courseId);
  const { notes, refresh: refreshNotes } = useNotes(user?.uid, courseId);
  const { bookmarks, refresh: refreshBookmarks } = useBookmarks(user?.uid);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lesson = useMemo(
    () => (course ? getLessonById(course.curriculum, lessonId) : null),
    [course, lessonId]
  );

  const { prev, next } = useMemo(
    () => (course ? getAdjacentLessons(course.curriculum, lessonId) : { prev: null, next: null }),
    [course, lessonId]
  );

  const isCompleted = enrollment?.completedLessons.includes(lessonId) ?? false;

  const isBookmarked = useMemo(
    () => bookmarks.some((b) => b.lessonId === lessonId && b.courseId === courseId),
    [bookmarks, lessonId, courseId]
  );

  const handleMarkComplete = useCallback(async () => {
    if (!user || !course) return;
    const totalLessons = getTotalLessons(course.curriculum);
    const updated = await updateLessonProgress(user.uid, courseId, lessonId, totalLessons);
    if (updated) {
      setEnrollment(updated);
      if (updated.progress >= 100) {
        router.push(`/learn/${courseId}/certificate`);
        return;
      }
    }
    if (next) {
      router.push(`/learn/${courseId}/lesson/${next.id}`);
    }
  }, [user, course, courseId, lessonId, next, router, setEnrollment]);

  const handleLessonClick = useCallback(
    (targetLessonId: string) => {
      router.push(`/learn/${courseId}/lesson/${targetLessonId}`);
    },
    [courseId, router]
  );

  const handleSaveNote = useCallback(
    async (content: string, existingNoteId?: string) => {
      if (!user) return;
      await saveNote(user.uid, courseId, lessonId, content, existingNoteId);
      await refreshNotes();
    },
    [user, courseId, lessonId, refreshNotes]
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      await deleteNote(noteId);
      await refreshNotes();
    },
    [refreshNotes]
  );

  const handleToggleBookmark = useCallback(async () => {
    if (!user || !course || !lesson) return;
    await toggleBookmark(user.uid, courseId, lessonId, lesson.title, course.title);
    await refreshBookmarks();
  }, [user, course, lesson, courseId, lessonId, refreshBookmarks]);

  const handleQuizComplete = useCallback(
    async (score: number, passed: boolean) => {
      if (passed) {
        await handleMarkComplete();
      }
    },
    [handleMarkComplete]
  );

  const handleAssignmentSubmit = useCallback(
    async (content: string) => {
      if (!user || !lesson?.assignment) return;
      await submitAssignmentFn(user.uid, lesson.assignment.id, content);
      await handleMarkComplete();
    },
    [user, lesson, handleMarkComplete]
  );

  if (courseLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-950 p-6">
          <LmsSkeletonLoader type="lessonContent" />
        </main>
      </ProtectedRoute>
    );
  }

  if (!course || !lesson) {
    return (
      <ProtectedRoute>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Lesson Not Found</h2>
            <Link href="/courses" className="mt-4 inline-block rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white">
              Browse Courses
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        {/* Top bar */}
        <div className="border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Link href={`/courses/${course.slug}`} className="rounded-xl border border-slate-800/70 bg-slate-900/80 p-2 text-slate-400 transition hover:text-white hover:border-slate-700">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 truncate">{course.title}</p>
                <p className="text-sm font-semibold text-white truncate">{lesson.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {enrollment && enrollment.progress >= 100 && (
                <Link
                  href={`/learn/${courseId}/certificate`}
                  className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  View Certificate
                </Link>
              )}
              <div className="hidden w-40 sm:block">
                <ProgressBar value={enrollment?.progress ?? 0} size="sm" showLabel={false} />
              </div>
              <span className="text-xs font-medium text-slate-400">{enrollment?.progress ?? 0}%</span>
              <BookmarkButton isBookmarked={isBookmarked} onClick={handleToggleBookmark} size="sm" />
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl border border-slate-800/70 bg-slate-900/80 p-2 text-slate-400 transition hover:text-white lg:hidden"
              >
                {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
          {/* Lesson content */}
          <div className="space-y-6">
            <LessonContent
              lesson={lesson}
              onQuizComplete={handleQuizComplete}
              onAssignmentSubmit={handleAssignmentSubmit}
            />

            {/* Bottom navigation */}
            <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-4">
              <div>
                {prev ? (
                  <button
                    onClick={() => handleLessonClick(prev.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                ) : (
                  <div />
                )}
              </div>

              <button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-violet-500 text-white hover:bg-violet-400'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isCompleted ? 'Completed' : next ? 'Complete & Next' : 'Complete Course'}
              </button>

              <div>
                {next ? (
                  <button
                    onClick={() => handleLessonClick(next.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Q&A Discussions */}
            <LessonDiscussions lessonId={lessonId} courseId={courseId} />
          </div>

          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-6">
              <LessonSidebar
                curriculum={course.curriculum}
                completedLessons={enrollment?.completedLessons ?? []}
                currentLessonId={lessonId}
                progress={enrollment?.progress ?? 0}
                notes={notes}
                currentResources={lesson.resources}
                bookmarks={bookmarks.filter((b) => b.courseId === courseId)}
                onLessonClick={handleLessonClick}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
