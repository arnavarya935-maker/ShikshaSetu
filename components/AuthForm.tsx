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
        // Use Magic Link for signup to ensure email is verified instantly
        await signInWithMagicLink(email);
        setMessage(t('auth_email_verified_sent') || 'Check your email for the magic login link!');
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage(t('auth_reset_sent'));
      } else {
        await signIn(email, password);
      }
    } catch (caughtError: any) {
      const errorMessage = caughtError?.message || 'Something went wrong.';
      if (errorMessage.toLowerCase().includes('rate limit')) {
        setError('You have attempted to sign up too many times. Please wait an hour before trying again, or use another email.');
      } else {
        setError(errorMessage);
      }
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

      {/* No name field needed for magic link signup, we can gather it during onboarding */}
      
      <div className="space-y-1.5">
        <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t('auth_email_label')}</label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth_email_placeholder')}
          required
          className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
        />
      </div>

      {mode === 'login' ? (
        <div className="space-y-1.5">
          <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t('auth_password_label')}</label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth_password_placeholder')}
            required
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
      ) : null}

      {mode === 'login' ? (
        <div className="flex items-center justify-end text-xs">
          <Link href="/forgot-password" className="font-medium text-zinc-600 dark:text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white">
            {t('auth_forgot_link')}
          </Link>
        </div>
      ) : null}

      <button
        type="submit"
        aria-label={mode === 'login' ? 'Login to your account' : mode === 'signup' ? 'Send Magic Link' : 'Reset your password'}
        disabled={isSubmitting || !isConfigured}
        className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-5 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mode === 'login' ? t('auth_btn_login') : mode === 'signup' ? 'Send Magic Link' : t('auth_btn_forgot')}
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
            aria-label="Sign in with Google"
            disabled={isSubmitting || !isConfigured}
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
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

