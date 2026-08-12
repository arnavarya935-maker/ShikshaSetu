'use client';

import type { Course } from '../../lib/lms/types';
import CourseCard from './CourseCard';
import LmsSkeletonLoader from './LmsSkeletonLoader';

type CourseGridProps = {
  courses: Course[];
  loading?: boolean;
};

export default function CourseGrid({ courses, loading }: CourseGridProps) {
  if (loading) {
    return <LmsSkeletonLoader type="courseGrid" count={6} />;
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-800/80 bg-slate-950/70 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">No results</p>
        <h3 className="mt-4 text-xl font-semibold text-white">No courses match your filters</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          Try adjusting your search query, category, or level filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
