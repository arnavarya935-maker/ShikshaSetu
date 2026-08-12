'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useLanguage } from '../lib/language/LanguageContext';

type AuthFormProps = {
  mode: 'login' | 'signup' | 'forgot';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, signInWithGoogle, resetPassword, isConfigured } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        setMessage(t('auth_email_verified_sent'));
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage(t('auth_reset_sent'));
      } else {
        await signIn(email, password);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message ? <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-200">{message}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs font-medium text-rose-800 dark:text-rose-200">{error}</div> : null}

      {mode === 'signup' ? (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t('auth_name_label')}</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('auth_name_placeholder')}
            required
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t('auth_email_label')}</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth_email_placeholder')}
          required
          className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
        />
      </div>

      {mode !== 'forgot' ? (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t('auth_password_label')}</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth_password_placeholder')}
            required
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
      ) : null}

      {mode !== 'forgot' ? (
        <div className="flex items-center justify-end text-xs">
          <Link href="/forgot-password" className="font-medium text-zinc-600 dark:text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white">
            {t('auth_forgot_link')}
          </Link>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !isConfigured}
        className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-5 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mode === 'login' ? t('auth_btn_login') : mode === 'signup' ? t('auth_btn_signup') : t('auth_btn_forgot')}
      </button>

      {mode !== 'forgot' ? (
        <>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="uppercase font-mono text-[10px] tracking-wider">{t('auth_or')}</span>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || !isConfigured}
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('auth_google')}
          </button>
        </>
      ) : null}


      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
        {mode === 'login' ? (
          <>{t('auth_no_account')} <Link href="/signup" className="font-semibold text-zinc-900 dark:text-white hover:underline">{t('nav_signup')}</Link></>
        ) : mode === 'signup' ? (
          <>{t('auth_has_account')} <Link href="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">{t('nav_login')}</Link></>
        ) : (
          <>{t('auth_remember_password')} <Link href="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">{t('nav_login')}</Link></>
        )}
      </div>
    </form>
  );
}

