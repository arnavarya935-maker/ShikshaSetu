type SectionHeadingProps = {
  title: string;
  subtitle: string;
};

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl text-center mx-auto space-y-4">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50 dark:bg-zinc-900/60 px-3.5 py-1 text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-700 dark:text-zinc-300 shadow-sm">
        <span className="text-zinc-500">✦</span>
        <span>SHIKSHASETU</span>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

