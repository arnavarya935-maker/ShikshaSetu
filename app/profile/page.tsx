'use client';

import ProtectedRoute from '../../components/ProtectedRoute';

import { useAuth } from '../../components/AuthProvider';
import UserProfileCard from '../../components/UserProfileCard';

export default function ProfilePage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-16 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <UserProfileCard />
          <button
            onClick={() => logout()}
            className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-2.5 text-xs font-medium text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
          >
            Logout
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}

