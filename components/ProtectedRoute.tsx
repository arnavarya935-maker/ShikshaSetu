'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowIncompleteProfile?: boolean;
};

export default function ProtectedRoute({ children, allowIncompleteProfile = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }

      if (!allowIncompleteProfile && user && (!profile || !profile.onboardingComplete)) {
        router.replace('/onboarding');
      }
    }
  }, [allowIncompleteProfile, loading, profile, router, user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg text-slate-300">Checking your session...</p>
      </main>
    );
  }

  if (!user) return null;

  if (!allowIncompleteProfile && (!profile || !profile.onboardingComplete)) return null;

  return <>{children}</>;
}
