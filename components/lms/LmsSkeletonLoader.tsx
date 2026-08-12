'use client';

type LmsSkeletonLoaderProps = {
  type: 'courseGrid' | 'lessonContent' | 'sidebar';
  count?: number;
};

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-800/50 ${className ?? ''}`}
    />
  );
}

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-800/60 bg-slate-950/90">
      <ShimmerBlock className="h-44 !rounded-none" />
      <div className="space-y-3 p-5">
        <ShimmerBlock className="h-3 w-20" />
        <ShimmerBlock className="h-5 w-full" />
        <ShimmerBlock className="h-4 w-3/4" />
        <div className="pt-3">
          <ShimmerBlock className="h-3 w-28" />
          <div className="mt-3 flex items-center justify-between">
            <ShimmerBlock className="h-4 w-24" />
            <ShimmerBlock className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonContentSkeleton() {
  return (
    <div className="space-y-6">
      <ShimmerBlock className="h-[400px] w-full !rounded-[1.5rem]" />
      <div className="space-y-3">
        <ShimmerBlock className="h-6 w-2/3" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-5/6" />
        <ShimmerBlock className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <ShimmerBlock className="h-8 w-full" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-2 pl-3">
          <ShimmerBlock className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function LmsSkeletonLoader({ type, count = 1 }: LmsSkeletonLoaderProps) {
  if (type === 'courseGrid') {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (type === 'lessonContent') {
    return <LessonContentSkeleton />;
  }

  return <SidebarSkeleton />;
}
