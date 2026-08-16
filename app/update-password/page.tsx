'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthPageShell from '../../components/AuthPageShell';
import { useAuth } from '../../components/AuthProvider';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updatePassword(password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      setLoading(false);
    }
  };

  return (
    <AuthPageShell accentTitle="Secure your account" title="Set new password" description="Please enter your new password below to regain access.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs font-medium text-rose-800 dark:text-rose-200">{error}</div> : null}
        
        <div className="space-y-1.5">
          <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">New Password</label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
            required
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-5 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthPageShell>
  );
}
