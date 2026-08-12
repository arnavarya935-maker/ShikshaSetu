'use client';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-[2.5rem] border border-dashed border-rose-200 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-900/50 p-10 sm:p-14 text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1 text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 shadow-sm">
        <span>✦</span>
        <span>NOTHING HERE YET</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider !text-white dark:!text-zinc-900 shadow-sm transition hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

