'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('System Exception boundary caught error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/25">
          <AlertTriangle className="h-7 w-7 text-rose-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred during execution. Please reload or click try again to restore your study session.
          </p>
        </div>

        {error.message && (
          <div className="rounded-xl border border-slate-900 bg-slate-900/35 p-3 text-left">
            <p className="font-mono text-[10px] text-slate-500 break-all leading-normal">
              Exception: {error.message}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-350 hover:text-white"
          >
            Reload Page
          </button>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-400"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}
