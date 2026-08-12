'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore, googleProvider, isFirebaseConfigured } from '../lib/firebase';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      return null;
    }

    const firestore = getFirebaseFirestore();
    if (!firestore) {
      return null;
    }

    const profileRef = doc(firestore, 'users', currentUser.uid);

    try {
      const profileSnapshot = await getDoc(profileRef);
      if (!profileSnapshot.exists()) {
        return null;
      }

      const profileData = profileSnapshot.data() as Partial<UserProfile>;

      return {
        name: profileData.name ?? currentUser.displayName ?? '',
        institute: profileData.institute ?? '',
        role: (profileData.role as ProfileRole) ?? 'student',
        onboardingComplete: Boolean(profileData.onboardingComplete),
        title: profileData.title ?? '',
        bio: profileData.bio ?? '',
      } as UserProfile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth || !isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    const handleAuthStateChanged = async (currentUser: User | null) => {
      if (!mounted) {
        return;
      }

      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const loadedProfile = await loadUserProfile(currentUser);
      if (!mounted) {
        return;
      }

      setProfile(loadedProfile);
      setLoading(false);
    };

    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e) {
        // ignore persistence errors; we'll still listen for auth state
      }

      if (!mounted) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        void handleAuthStateChanged(currentUser);
      });
    })();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const completeOnboarding = async (profileInput: OnboardingProfileInput) => {
    const auth = getFirebaseAuth();
    if (!auth || !user) {
      throw new Error('A signed-in user is required to complete onboarding.');
    }

    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firestore is not configured.');
    }

    const profileRef = doc(firestore, 'users', user.uid);
    const profileToSave: UserProfile = {
      ...profileInput,
      onboardingComplete: true,
    };

    await setDoc(profileRef, profileToSave, { merge: true });

    if (profileInput.name && user.displayName !== profileInput.name) {
      await updateProfile(user, { displayName: profileInput.name });
    }

    setProfile(profileToSave);
    router.replace('/dashboard');
  };

  const signUp = async (email: string, password: string, name: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase authentication is not configured yet.');
    }

    const { user: createdUser } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(createdUser, { displayName: name });
    }
    await sendEmailVerification(createdUser);

    setUser(createdUser);
    router.push('/dashboard');
  };

  const signIn = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase authentication is not configured yet.');
    }

    const { user: signedInUser } = await signInWithEmailAndPassword(auth, email, password);
    if (!signedInUser.emailVerified) {
      await sendEmailVerification(signedInUser);
    }

    setUser(signedInUser);
    router.push('/dashboard');
  };

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase authentication is not configured yet.');
    }

    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    router.push('/dashboard');
  };

  const resetPassword = async (email: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase authentication is not configured yet.');
    }

    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      throw new Error('No signed-in user available.');
    }

    await sendEmailVerification(user);
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setProfile(null);
    router.replace('/login');
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    isConfigured: isFirebaseConfigured(),
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
