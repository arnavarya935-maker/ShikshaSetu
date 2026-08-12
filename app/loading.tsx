'use client';

export default function GlobalLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-violet-500" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 animate-pulse">
          Loading ShikshaSetu...
        </p>
      </div>
    </main>
  );
}
