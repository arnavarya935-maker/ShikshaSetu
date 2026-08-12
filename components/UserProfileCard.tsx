'use client';

import { Building } from 'lucide-react';
import { useAuth } from './AuthProvider';

type UserProfileCardProps = {
  className?: string;
};

export default function UserProfileCard({ className }: UserProfileCardProps) {
  const { user, profile } = useAuth();

  const name = profile?.name ?? user?.displayName ?? 'prateek singh bisht';
  const role = (profile?.role ?? 'student').toUpperCase();
  const institute = profile?.institute ?? 'piet';

  // Extract initials (e.g., "PR")
  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'PR';

  return (
    <div className={`w-full max-w-sm rounded-xl border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col items-center justify-center text-center shadow-none transition-colors ${className ?? ''}`}>
      {/* Neutral #F3F3F3 Avatar Circle */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F3F3F3] dark:bg-zinc-800 transition-colors">
        <span className="text-2xl font-bold text-[#171717] dark:text-white tracking-tight">
          {initials}
        </span>
      </div>

      {/* Dark #171717 Name */}
      <h3 className="mt-5 text-lg font-bold text-[#171717] dark:text-white tracking-tight leading-snug break-words max-w-full">
        {name.toLowerCase()}
      </h3>

      {/* Muted Gray #6B7280 Role */}
      <p className="mt-1.5 text-xs font-mono font-medium uppercase tracking-[0.18em] text-[#6B7280] dark:text-zinc-400">
        {role}
      </p>

      {/* Muted Gray #6B7280 Institute Icon & Text */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-zinc-400">
        <Building className="h-3.5 w-3.5 text-[#6B7280] dark:text-zinc-400" />
        <span>{institute.toLowerCase()}</span>
      </div>
    </div>
  );
}
