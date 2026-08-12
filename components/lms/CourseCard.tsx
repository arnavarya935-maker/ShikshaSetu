'use client';

import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import StarRating from './StarRating';
import { formatDuration, getLevelColor } from '../../lib/lms/utils';
import type { Course } from '../../lib/lms/types';

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-soft transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-elevated"
    >
      {/* Thumbnail */}
      <div
        className="relative flex h-44 items-end p-5 transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ background: course.thumbnail }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        <div className="relative flex w-full items-end justify-between">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider ${getLevelColor(course.level)}`}
          >
            {course.level}
          </span>
          {course.price === 0 ? (
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              FREE
            </span>
          ) : (
            <span className="rounded-full bg-zinc-900/90 dark:bg-white/90 px-3 py-1 text-xs font-mono font-bold text-white dark:text-zinc-900">
              ₹{course.price}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">{course.category}</p>
        <h3 className="mt-1.5 text-base font-semibold tracking-tight leading-snug text-zinc-900 dark:text-white line-clamp-2 transition-colors">
          {course.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">{course.description}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{course.instructor.name}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={course.rating} size={14} />
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.enrolledCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(course.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

