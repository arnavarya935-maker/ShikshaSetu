import Link from 'next/link';
import DarkModeToggle from '../app/dark';
import Logo from './Logo';


type AuthPageShellProps = {
  accentTitle: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthPageShell({ accentTitle, title, description, children }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="absolute top-6 right-6 z-50">
        <DarkModeToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-8 rounded-[2.5rem] border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-8 sm:p-12 lg:grid-cols-[0.95fr_1.05fr] shadow-elevated">
          <div className="space-y-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 flex flex-col justify-between">
            <div className="space-y-5">
              <Logo className="mb-4" />
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1 text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-700 dark:text-zinc-300">
                <span>✦</span>
                <span>{accentTitle}</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{title}</h1>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
              
              <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-2">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3 flex items-center gap-2">
                  <span className="text-zinc-400">✦</span> Secure account access with Firebase Auth
                </div>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3 flex items-center gap-2">
                  <span className="text-zinc-400">✦</span> Protected study dashboard & progress tracking
                </div>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3 flex items-center gap-2">
                  <span className="text-zinc-400">✦</span> Smooth sign-in across devices with Google support
                </div>
              </div>
            </div>

            <Link href="/" className="inline-flex text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white pt-4">
              ← Back to home
            </Link>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

