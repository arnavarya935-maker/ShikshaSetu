'use client';

import clsx from 'clsx';

type ProgressBarProps = {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function ProgressBar({ value, showLabel = true, size = 'md', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</span>
          <span className="text-slate-800 dark:text-slate-200">{clamped}%</span>
        </div>
      )}
      <div className={clsx('w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', heightMap[size])}>
        <div
          className={clsx(
            'rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 transition-all duration-700 ease-out',
            heightMap[size]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
