'use client';

import { useState, useEffect } from 'react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import { useAuth } from '../../../../components/AuthProvider';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../../lib/firebase';
import { User, School, BookOpen, FileText, Loader2, Sparkles } from 'lucide-react';
import UserProfileCard from '../../../../components/UserProfileCard';

export default function StudentProfilePage() {
  const { user, profile, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [institute, setInstitute] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync state when profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setInstitute(profile.institute ?? '');
      setTitle(profile.title ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setToast(null);

    const db = getFirebaseFirestore();
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          name,
          institute,
          title,
          bio,
          onboardingComplete: true,
          role: profile?.role ?? 'student'
        }, { merge: true });
        
        setToast('✅ Profile saved successfully!');
        setTimeout(() => {
          setToast(null);
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error('Failed to save profile:', err);
        setToast('❌ Failed to save profile. Please try again.');
      } finally {
        setSaving(false);
      }
    } else {
      setToast('❌ Database connection error.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RoleProtectedRoute allowedRoles={['student']}>
        <DashboardShell
          title="Student Profile"
          subtitle="Manage your personal learning profile and credentials."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/student' },
            { label: 'Profile' }
          ]}
        >
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        </DashboardShell>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="Student Profile"
        subtitle="Manage your personal learning profile and credentials."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Profile' }
        ]}
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {toast && (
            <div className="rounded-2xl border border-violet-500/30 bg-slate-900 px-6 py-4 text-sm font-semibold text-violet-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {toast}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-[1fr_2fr] items-start">
            {/* Enterprise User Profile Card */}
            <UserProfileCard className="mx-auto" />


            {/* Profile Form */}
            <DashboardCard title="Edit Details" description="Update your default information on ShikshaSetu.">
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative mt-2">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vicky Kumar"
                      className="w-full rounded-2xl border border-slate-850 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">School / Institute</label>
                  <div className="relative mt-2">
                    <School className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={institute}
                      onChange={(e) => setInstitute(e.target.value)}
                      placeholder="Indian Institute of Technology"
                      className="w-full rounded-2xl border border-slate-850 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Academic Title / Focus</label>
                  <div className="relative mt-2">
                    <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Computer Science Undergrad"
                      className="w-full rounded-2xl border border-slate-850 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Short Bio</label>
                  <div className="relative mt-2">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your learning goals..."
                      rows={3}
                      className="w-full rounded-2xl border border-slate-850 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </DashboardCard>
          </div>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
