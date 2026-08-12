'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PartyPopper } from 'lucide-react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import CertificateCard from '../../../../components/lms/CertificateCard';
import { useAuth } from '../../../../components/AuthProvider';
import { useCourse, useCertificates } from '../../../../lib/lms/hooks';
import { useLanguage } from '../../../../lib/language/LanguageContext';
import { useMemo } from 'react';

export default function CertificatePage() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  const { user, profile } = useAuth();
  const { course } = useCourse(courseId);
  const { certificates, loading } = useCertificates(user?.uid);
  const { t } = useLanguage();

  const certificate = useMemo(
    () => certificates.find((c) => c.courseId === courseId) ?? null,
    [certificates, courseId]
  );

  // Build a fallback certificate for display even if not in Firestore yet
  const displayCert = certificate ?? {
    id: 'preview',
    userId: user?.uid ?? '',
    courseId,
    courseName: course?.title ?? 'Course',
    userName: profile?.name ?? user?.displayName ?? 'Student',
    earnedAt: new Date().toISOString(),
    certificateNumber: 'SS-PREVIEW',
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        {/* Top bar */}
        <div className="border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
            <Link
              href={`/courses/${course?.slug ?? ''}`}
              className="rounded-xl border border-slate-800/70 bg-slate-900/80 p-2 text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs text-slate-500">{t('nav_dashboard')}</p>
              <p className="text-sm font-semibold text-white">{course?.title ?? 'Course'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          {/* Celebration */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
              <PartyPopper className="h-8 w-8 text-violet-300" />
            </div>
            <h1 className="text-3xl font-bold text-white">{t('cert_congrats')}</h1>
            <p className="mt-2 text-slate-400">
              {t('cert_congrats_desc')}{' '}
              <span className="font-semibold text-violet-300">{course?.title}</span>
            </p>
          </div>

          {/* Certificate */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
            </div>
          ) : (
            <CertificateCard certificate={displayCert} />
          )}

          {/* Back links */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard/student/courses"
              className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white"
            >
              {t('dash_nav_my_courses')}
            </Link>
            <Link
              href="/courses"
              className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              {t('dash_nav_explore')}
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
