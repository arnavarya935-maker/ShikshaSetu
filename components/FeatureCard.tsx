import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 p-8 transition-all duration-300 hover:shadow-elevated hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col justify-between space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 font-medium">
            ✦ AI PLATFORM
          </span>
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
        <span>Learn more</span>
        <span>→</span>
      </div>
    </div>
  );
}

