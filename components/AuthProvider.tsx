'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase/client';

// Compatibility shim: adds Firebase-style properties so all existing code
// using user.uid / user.displayName / user.email works without modification.
export type User = SupabaseUser & {
  uid: string;
  displayName: string | null;
};

export type ProfileRole = 'student' | 'teacher' | 'admin';

type UserProfile = {
  name: string;
  institute: string;
  role: ProfileRole;
  onboardingComplete: boolean;
  title?: string;
  bio?: string;
};

type OnboardingProfileInput = Omit<UserProfile, 'onboardingComplete'>;

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  isConfigured: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (profile: OnboardingProfileInput) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper: wrap a Supabase user with Firebase-compatible properties
function toCompatUser(u: SupabaseUser | null): User | null {
  if (!u) return null;
  return {
    ...u,
    uid: u.id,
    displayName: u.user_metadata?.full_name ?? u.email ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const loadUserProfile = async (currentUser: User | null) => {
    if (!currentUser) return null;

    let profileData = null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      if (!error && data) profileData = data;
    } catch (error) {
      console.warn('Failed to fetch from users table:', error);
    }
    
    const meta = currentUser.user_metadata || {};
    const hasDbProfile = !!profileData;
    const hasMetaProfile = !!meta.onboardingComplete;

    if (!hasDbProfile && !hasMetaProfile) return null;

    return {
      name: profileData?.name ?? meta?.full_name ?? '',
      institute: profileData?.institute ?? meta?.institute ?? '',
      role: (profileData?.role as ProfileRole) ?? meta?.role ?? 'student',
      onboardingComplete: Boolean(profileData?.onboardingComplete || meta?.onboardingComplete),
      title: profileData?.title ?? meta?.title ?? '',
      bio: profileData?.bio ?? meta?.bio ?? '',
    } as UserProfile;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        const compatUser = toCompatUser(session?.user ?? null);
        setUser(compatUser);
        if (compatUser) {
          const loadedProfile = await loadUserProfile(compatUser);
          setProfile(loadedProfile);
        }
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const compatUser = toCompatUser(session?.user ?? null);
        setUser(compatUser);
        if (compatUser) {
          const loadedProfile = await loadUserProfile(compatUser);
          setProfile(loadedProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const completeOnboarding = async (profileInput: OnboardingProfileInput) => {
    if (!user) throw new Error('A signed-in user is required.');

    const profileToSave = {
      ...profileInput,
      id: user.id,
      onboardingComplete: true,
    };

    const { error } = await supabase.from('users').upsert(profileToSave);
    if (error) {
      console.warn('Failed to save profile to users table, falling back to auth metadata.', error);
    }

    const { error: authError } = await supabase.auth.updateUser({ 
      data: { 
        full_name: profileInput.name,
        institute: profileInput.institute,
        role: profileInput.role,
        onboardingComplete: true
      } 
    });

    if (authError) {
      console.error('Supabase Auth update error:', authError);
      throw authError;
    }

    setProfile(profileToSave as UserProfile);
    router.replace('/dashboard');
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) throw error;
    setUser(toCompatUser(data.user));
    router.push('/dashboard');
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(toCompatUser(data.user));
    router.push('/dashboard');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const sendVerificationEmail = async () => {
    if (!user?.email) throw new Error('No user email.');
    await supabase.auth.resend({ type: 'signup', email: user.email });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace('/login');
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    isConfigured: true,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    sendVerificationEmail,
    logout,
    completeOnboarding,
  }), [loading, user, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
