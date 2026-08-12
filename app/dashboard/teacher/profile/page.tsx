'use client';

import { useState, useEffect } from 'react';
import { User, School, Award, FileText, Check } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import { useAuth } from '../../../../components/AuthProvider';
import { getFirebaseFirestore } from '../../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import UserProfileCard from '../../../../components/UserProfileCard';

export default function EducatorProfilePage() {

  const { user, profile } = useAuth();
  
  const [name, setName] = useState(profile?.name ?? user?.displayName ?? '');
  const [institute, setInstitute] = useState(profile?.institute ?? '');
  const [title, setTitle] = useState((profile as any)?.title ?? 'Course Instructor');
  const [bio, setBio] = useState((profile as any)?.bio ?? '');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setInstitute(profile.institute ?? '');
      setTitle((profile as any).title ?? 'Course Instructor');
      setBio((profile as any).bio ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(false);

    try {
      const db = getFirebaseFirestore();
      if (db) {
        const ref = doc(db, 'users', user.uid);
        await setDoc(ref, {
          name,
          institute,
          title,
          bio,
        }, { merge: true });
      }
      
      // Update local profile state in memory if needed (will refresh on page reload)
      if (profile) {
        profile.name = name;
        profile.institute = institute;
        (profile as any).title = title;
        (profile as any).bio = bio;
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Educator Portfolio"
        subtitle="Update your professional credentials, biography, and institution details."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Profile' }]}
      >
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-[1fr_2fr] items-start">
          <UserProfileCard className="mx-auto" />
          <form onSubmit={handleSubmit}>

            <DashboardCard
              title="Instructor Profile Card"
              description="Personalize your identity as seen by enrolled students."
            >
              <div className="space-y-4 text-xs">
                {/* Name */}
                <div className="grid gap-2">
                  <label className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-violet-400" />
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500"
                  />
                </div>

                {/* Institution */}
                <div className="grid gap-2">
                  <label className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-violet-400" />
                    Institute / Affiliation
                  </label>
                  <input
                    type="text"
                    required
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    placeholder="e.g. ShikshaSetu Academy"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500"
                  />
                </div>

                {/* Professional Title */}
                <div className="grid gap-2">
                  <label className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-violet-400" />
                    Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Principal Web Educator"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500"
                  />
                </div>

                {/* Bio */}
                <div className="grid gap-2">
                  <label className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-violet-400" />
                    Biography / Background
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about your industry credentials, certifications, and teaching approach..."
                    rows={6}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-violet-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Save Actions */}
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-violet-400 transition disabled:opacity-40"
                  >
                    {saving ? 'Saving...' : success ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Saved Successfully
                      </>
                    ) : 'Save Biography'}
                  </button>
                </div>
              </div>
            </DashboardCard>
          </form>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
