'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type ProfileRole } from './AuthProvider';

type RoleProtectedRouteProps = {
  allowedRoles: ProfileRole[];
  children: React.ReactNode;
};

export default function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }

      if (!profile || !profile.onboardingComplete) {
        router.replace('/onboarding');
        return;
      }

      if (!allowedRoles.includes(profile.role)) {
        router.replace('/dashboard');
      }
    }
  }, [allowedRoles, loading, profile, router, user]);

  if (loading || !user || !profile || !profile.onboardingComplete) {
    return null;
  }

  if (!allowedRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
}
