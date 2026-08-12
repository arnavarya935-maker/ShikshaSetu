'use client';

import { Bookmark } from 'lucide-react';
import clsx from 'clsx';

type BookmarkButtonProps = {
  isBookmarked: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
};

export default function BookmarkButton({ isBookmarked, onClick, size = 'md' }: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
      className={clsx(
        'rounded-xl border transition-all duration-200',
        size === 'sm' ? 'p-1.5' : 'p-2.5',
        isBookmarked
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
          : 'border-slate-800/70 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-amber-400'
      )}
    >
      <Bookmark
        className={clsx(
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          isBookmarked && 'fill-amber-400'
        )}
      />
    </button>
  );
}
