'use client';

import { Flame } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function StreakWidget() {
  const { profile } = useAuth();
  const streak = profile?.streak || 0;

  if (!profile) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-orange-200/60 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 shadow-sm transition-all hover:scale-105">
      <Flame className="h-3.5 w-3.5" />
      <span>{streak} Day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
