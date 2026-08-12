'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, BarChart3, CheckCircle2, BookOpen, Play } from 'lucide-react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StarRating from '../../../components/lms/StarRating';
import CurriculumAccordion from '../../../components/lms/CurriculumAccordion';
import LmsSkeletonLoader from '../../../components/lms/LmsSkeletonLoader';
import { useCourse, useEnrollment } from '../../../lib/lms/hooks';
import { useAuth } from '../../../components/AuthProvider';
import { enrollInCourse } from '../../../lib/lms/firestore';
import { formatDurationLong, getLevelColor, getTotalLessons } from '../../../lib/lms/utils';
import { useState } from 'react';
import PaymentModal from '../../../components/lms/PaymentModal';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { course, loading: courseLoading } = useCourse(slug);
  const { user } = useAuth();
  const { enrollment, loading: enrollLoading } = useEnrollment(user?.uid, course?.id ?? '');
  const [enrolling, setEnrolling] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleEnroll = async () => {
    if (!user || !course) return;
    if (course.price > 0) {
      setPaymentOpen(true);
      return;
    }

    setEnrolling(true);
    try {
      await enrollInCourse(user.uid, course.id);
      router.push(`/learn/${course.id}`);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentOpen(false);
    if (!user || !course) return;
    setEnrolling(true);
    try {
      await enrollInCourse(user.uid, course.id);
      router.push(`/learn/${course.id}`);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinue = () => {
    if (!course) return;
    router.push(`/learn/${course.id}`);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          courseTitle={course?.title ?? ''}
          coursePrice={course?.price ?? 0}
        />
        {courseLoading ? (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <LmsSkeletonLoader type="lessonContent" />
          </div>
        ) : !course ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">Course Not Found</h2>
              <p className="mt-2 text-slate-400">The course you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/courses" className="mt-6 inline-block rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-slate-800/50">
              <div className="absolute inset-0" style={{ background: course.thumbnail, opacity: 0.12 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60" />
              <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back */}
                <Link href="/courses" className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/50 px-3 py-1.5 text-xs text-slate-400 transition hover:text-white hover:border-slate-600">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Courses
                </Link>

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                  {/* Info */}
                  <div className="space-y-5">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight">{course.title}</h1>
                    <p className="text-base text-slate-300 leading-relaxed max-w-2xl">{course.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <StarRating rating={course.rating} />
                      <span>({course.reviewCount} reviews)</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.enrolledCount.toLocaleString()} students</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-sm font-bold text-violet-300">
                        {course.instructor.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{course.instructor.name}</p>
                        <p className="text-xs text-slate-500">{course.instructor.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enroll card */}
                  <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] self-start">
                    {/* Thumbnail mini */}
                    <div className="mb-5 aspect-video overflow-hidden rounded-xl" style={{ background: course.thumbnail }}>
                      <div className="flex h-full items-center justify-center">
                        <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      {course.price === 0 ? (
                        <p className="text-3xl font-bold text-white">Free</p>
                      ) : (
                        <p className="text-3xl font-bold text-white">₹{course.price}</p>
                      )}
                    </div>

                    {enrollment ? (
                      <button
                        onClick={handleContinue}
                        className="w-full rounded-full bg-violet-500 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400"
                      >
                        Continue Learning
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full rounded-full bg-violet-500 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}

                    <div className="mt-5 space-y-3 text-sm text-slate-400">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" />{formatDurationLong(course.duration)} total</div>
                      <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-slate-500" />{getTotalLessons(course.curriculum)} lessons</div>
                      <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-500" />{course.curriculum.length} modules</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-500" />Certificate on completion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                <div className="space-y-10">
                  {/* What you'll learn */}
                  <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">What you&apos;ll learn</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.whatYoullLearn.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Long description */}
                  <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">About this course</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">{course.longDescription}</p>
                  </section>

                  {/* Requirements */}
                  <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Instructor */}
                  <section className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Instructor</h2>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-lg font-bold text-violet-300">
                        {course.instructor.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{course.instructor.name}</p>
                        <p className="text-sm text-slate-500">{course.instructor.title}</p>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Curriculum sidebar */}
                <div>
                  <div className="sticky top-6">
                    <h2 className="mb-4 text-lg font-semibold text-white">Course Curriculum</h2>
                    <CurriculumAccordion
                      curriculum={course.curriculum}
                      completedLessons={enrollment?.completedLessons ?? []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
