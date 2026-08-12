'use client';

import clsx from 'clsx';

type CategoryPillProps = {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
};

export default function CategoryPill({ label, icon, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors shadow-none',
        active
          ? 'border-transparent bg-[#171717] dark:bg-white !text-white dark:!text-[#171717] hover:bg-[#262626] dark:hover:bg-zinc-100'
          : 'border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
      )}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {label}
    </button>

  );
}

