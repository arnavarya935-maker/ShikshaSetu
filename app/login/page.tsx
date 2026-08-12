"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import AuthPageShell from '../../components/AuthPageShell';
import { useAuth } from '../../components/AuthProvider';

export default function LoginPage() {
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
    <AuthPageShell accentTitle="Quick access" title="Welcome back" description="Sign in to continue your learning journey with a calm, simple experience.">
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
