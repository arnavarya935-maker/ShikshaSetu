'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './AuthProvider';
import DarkModeToggle from '../app/dark';
import { useLanguage } from '../lib/language/LanguageContext';

const roles = [
  { value: 'student', labelKey: 'dash_role_student' },
  { value: 'teacher', labelKey: 'dash_role_teacher' },
  { value: 'admin', labelKey: 'dash_role_admin' },
] as const;

type Role = (typeof roles)[number]['value'];

export default function Onboarding() {
  const router = useRouter();
  const { user, profile, completeOnboarding, loading } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [institute, setInstitute] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (profile?.onboardingComplete) {
        router.replace('/dashboard');
      } else if (user.displayName && !name) {
        setName(user.displayName);
      }
    }
  }, [loading, profile, router, user, name]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg text-slate-300">Loading onboarding...</p>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding({ name, institute, role });
      router.replace('/dashboard');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to complete onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowIncompleteProfile>
      <main className="relative min-h-screen bg-slate-950 text-slate-100 px-6 py-16 sm:px-10 lg:px-16">
        <div className="absolute top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_30px_80px_rgba(2,8,23,0.55)] sm:p-10">
          <h1 className="text-3xl font-semibold text-white">{t('onboard_title')}</h1>
          <p className="mt-3 text-slate-400">{t('onboard_desc')}</p>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-955/70 p-4 text-slate-300">
            <p className="text-sm">
              {t('onboard_banner')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

            <div>
              <label className="block text-sm font-medium text-slate-300">{t('onboard_name_label')}</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">{t('onboard_institute_label')}</label>
              <input
                value={institute}
                onChange={(event) => setInstitute(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">{t('onboard_role_label')}</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-zinc-400"
              >
                {roles.map((item) => (
                  <option key={item.value} value={item.value} className="bg-slate-950 text-slate-100">
                    {t(item.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-5 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('onboard_btn')}
            </button>

          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
