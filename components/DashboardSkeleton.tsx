'use client';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.25)]">
          <div className="space-y-4">
            <div className="h-5 w-2/5 rounded-full bg-slate-800" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-[1.25rem] bg-slate-800" />
              <div className="h-24 rounded-[1.25rem] bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
