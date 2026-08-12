'use client';

type DashboardTileProps = {
  title: string;
  description: string;
};

export default function DashboardTile({ title, description }: DashboardTileProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 text-zinc-900 dark:text-zinc-100 transition hover:border-zinc-400 dark:hover:border-zinc-600">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}

