import type { Course, Module, Lesson, Enrollment } from './types';

/* ── Duration formatting ──────────────────────────────────── */

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDurationLong(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hour${h > 1 ? 's' : ''}`;
  return `${h} hour${h > 1 ? 's' : ''} ${m} min`;
}

/* ── Progress helpers ─────────────────────────────────────── */

export function getTotalLessons(curriculum: Module[]): number {
  return curriculum.reduce((sum, mod) => sum + mod.lessons.length, 0);
}

export function calculateProgress(completedLessons: string[], curriculum: Module[]): number {
  const total = getTotalLessons(curriculum);
  if (total === 0) return 0;
  return Math.round((completedLessons.length / total) * 100);
}

export function getAllLessons(curriculum: Module[]): Lesson[] {
  return curriculum.flatMap((mod) => mod.lessons);
}

export function getNextLesson(
  curriculum: Module[],
  completedLessons: string[]
): Lesson | null {
  const all = getAllLessons(curriculum);
  return all.find((lesson) => !completedLessons.includes(lesson.id)) ?? null;
}

export function getLessonById(curriculum: Module[], lessonId: string): Lesson | null {
  for (const mod of curriculum) {
    const found = mod.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return null;
}

export function getModuleForLesson(curriculum: Module[], lessonId: string): Module | null {
  return curriculum.find((mod) => mod.lessons.some((l) => l.id === lessonId)) ?? null;
}

export function getAdjacentLessons(
  curriculum: Module[],
  lessonId: string
): { prev: Lesson | null; next: Lesson | null } {
  const all = getAllLessons(curriculum);
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

/* ── Search & Filter ──────────────────────────────────────── */

export function searchCourses(courses: Course[], query: string): Course[] {
  if (!query.trim()) return courses;
  const q = query.toLowerCase().trim();
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.instructor.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}

export function filterByCategory(courses: Course[], category: string): Course[] {
  if (!category || category === 'all') return courses;
  return courses.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

export function filterByLevel(courses: Course[], level: string): Course[] {
  if (!level || level === 'all') return courses;
  return courses.filter((c) => c.level === level);
}

export type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

export function sortCourses(courses: Course[], sort: SortOption): Course[] {
  const sorted = [...courses];
  switch (sort) {
    case 'popular':
      return sorted.sort((a, b) => b.enrolledCount - a.enrolledCount);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

/* ── Certificate ──────────────────────────────────────────── */

export function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [4, 4, 4].map(() =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  );
  return `SS-${segments.join('-')}`;
}

/* ── Date formatting ──────────────────────────────────────── */

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

/* ── Misc ─────────────────────────────────────────────────── */

export function getLevelColor(level: string): string {
  switch (level) {
    case 'beginner':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'intermediate':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'advanced':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    default:
      return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
