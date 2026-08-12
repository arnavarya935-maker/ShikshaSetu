'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Search, Filter, Trash2, Globe, EyeOff, User } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAdminCourses } from '../../../../lib/lms/hooks-admin';
import { getLevelColor } from '../../../../lib/lms/utils';

export default function AdminCoursesPage() {
  const { courses, loading, removeCourse } = useAdminCourses();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.category)));
  }, [courses]);

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Auditing Platform Courses"
        subtitle="Review, analyze metadata, or remove courses from ShikshaSetu."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Audit Courses' }]}
      >
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course title, description, instructor..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-650 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-850 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses audit grid */}
          {loading ? (
            <LmsSkeletonLoader type="courseGrid" count={3} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const isPublished = course.status === 'published';
                return (
                  <div
                    key={course.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80 shadow-soft flex flex-col justify-between"
                  >
                    {/* Cover thumbnail */}
                    <div className="h-28 p-4 relative" style={{ background: course.thumbnail }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                      <div className="relative flex h-full items-end justify-between">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {isPublished ? <Globe className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {course.status}
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{course.category}</p>
                          <span className="text-xs text-white font-bold">
                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          Instructor: {course.instructor.name}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {course.enrolledCount} enrolled • {course.curriculum?.reduce((sum, m) => sum + m.lessons.length, 0) ?? 0} lessons
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`ADMIN OVERRIDE: Are you sure you want to permanently delete course "${course.title}"?`)) {
                              removeCourse(course.id);
                            }
                          }}
                          className="rounded-lg p-1.5 border border-slate-800 text-slate-500 hover:text-rose-400 transition hover:bg-slate-900"
                          title="Admin Deletion Override"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
