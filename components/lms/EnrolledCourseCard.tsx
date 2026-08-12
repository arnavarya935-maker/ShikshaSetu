'use client';

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';
import type { Enrollment } from '../../lib/lms/types';
import { courses } from '../../lib/lms/data/courses';
import { formatDuration, timeAgo } from '../../lib/lms/utils';

type EnrolledCourseCardProps = {
  enrollment: Enrollment;
};

export default function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const course = courses.find((c) => c.id === enrollment.courseId);
  if (!course) return null;

  const isComplete = enrollment.progress >= 100;

  return (
    <div className="group overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition-all duration-300 hover:border-violet-500/40">
      {/* Gradient header */}
      <div className="relative h-28 p-4" style={{ background: course.thumbnail }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        <div className="relative flex h-full items-end justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{course.category}</p>
          {isComplete && (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-violet-200 transition-colors">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-400">{course.instructor.name}</p>
        </div>

        <ProgressBar value={enrollment.progress} size="sm" />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(enrollment.lastAccessedAt)}
          </span>

          <Link
            href={isComplete ? `/learn/${course.id}/certificate` : `/learn/${course.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-4 py-2 text-xs font-medium !text-white dark:!text-[#171717] transition-colors shadow-none"
          >
            <Play className="h-3.5 w-3.5" />
            {isComplete ? 'View Certificate' : 'Continue'}
          </Link>
        </div>
      </div>
    </div>
  );
}

