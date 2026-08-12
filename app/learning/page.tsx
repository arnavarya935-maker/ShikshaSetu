'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function LearningPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/courses');
  }, [router]);

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-400">Redirecting to courses...</p>
      </main>
    </ProtectedRoute>
  );
}
