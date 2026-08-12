'use client';

type DashboardStatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  accent?: string;
};

export default function DashboardStatCard({ label, value, subtext, accent }: DashboardStatCardProps) {
  return (
    <div className={`rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 p-5 shadow-soft text-zinc-900 dark:text-zinc-100 ${accent ?? ''}`}>
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</p>
      {subtext ? <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{subtext}</p> : null}
    </div>
  );
}

