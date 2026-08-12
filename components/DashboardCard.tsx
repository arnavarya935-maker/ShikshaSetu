'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

type DashboardCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export default function DashboardCard({ title, description, className, children }: DashboardCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx('rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 sm:p-7 shadow-soft text-zinc-900 dark:text-zinc-100', className)}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
          {description ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p> : null}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

