'use client';

import { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import SearchBar from '../../components/lms/SearchBar';
import FilterBar from '../../components/lms/FilterBar';
import CourseGrid from '../../components/lms/CourseGrid';
import { useCourses } from '../../lib/lms/hooks';
import type { SortOption } from '../../lib/lms/utils';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState<SortOption>('popular');

  const { courses, loading, total } = useCourses({ search, category, level, sort });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        {/* Hero banner */}
        <div className="relative overflow-hidden border-b border-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-400">
              Course Catalog
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Explore Courses
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-400">
              Discover {total} courses across programming, design, data science, and more. Learn at your own pace with expert-led content.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filters */}
          <FilterBar
            activeCategory={category}
            onCategoryChange={setCategory}
            activeLevel={level}
            onLevelChange={setLevel}
            activeSort={sort}
            onSortChange={setSort}
          />

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{courses.length}</span> course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid */}
          <CourseGrid courses={courses} loading={loading} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
