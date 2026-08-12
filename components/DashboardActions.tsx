'use client';

import Link from 'next/link';

type DashboardActionsProps = {
  items: Array<{
    label: string;
    description: string;
    href?: string;
    onClick?: () => void;
  }>;
};

export default function DashboardActions({ items }: DashboardActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const content = (
          <>
            <p className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-white transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              {item.label}
            </p>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{item.description}</p>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group block rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3.5 text-left text-xs font-medium text-[#171717] dark:text-zinc-200 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-none"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            onClick={item.onClick}
            type="button"
            className="group rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3.5 text-left text-xs font-medium text-[#171717] dark:text-zinc-200 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-none"
          >
            {content}
          </button>
        );

      })}
    </div>
  );
}

