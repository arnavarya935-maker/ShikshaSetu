"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }

      if (!profile) {
        router.replace('/onboarding');
        return;
      }

      if (!profile.onboardingComplete) {
        router.replace('/onboarding');
        return;
      }

      const target = profile.role === 'teacher' ? '/dashboard/teacher' : profile.role === 'admin' ? '/dashboard/admin' : '/dashboard/student';
      router.replace(target);
    }
  }, [loading, profile, router, user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg text-slate-300">Preparing your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <p className="text-lg text-slate-300">Redirecting to your dashboard...</p>
    </main>
  );
}
