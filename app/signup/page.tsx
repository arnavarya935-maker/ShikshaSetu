'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import AuthPageShell from '../../components/AuthPageShell';
import { useAuth } from '../../components/AuthProvider';

export default function SignupPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (!profile || !profile.onboardingComplete) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [loading, profile, router, user]);

  return (
    <AuthPageShell accentTitle="Start in minutes" title="Create your account" description="Join to access a clean learning space with helpful structure and quick guidance.">
      <AuthForm mode="signup" />
    </AuthPageShell>
  );
}
