'use client';

import Link from 'next/link';
import { Plus, Edit3, Trash2, Globe, EyeOff, AlertCircle } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import EmptyState from '../../../../components/EmptyState';
import { useAuth } from '../../../../components/AuthProvider';
import { useTeacherCourses } from '../../../../lib/lms/hooks-teacher';
import { getLevelColor } from '../../../../lib/lms/utils';

export default function TeacherCoursesPage() {
  const { user } = useAuth();
  const { courses, loading, remove, togglePublish } = useTeacherCourses(user?.uid);

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Course Management"
        subtitle="Manage the classes and learning paths you are currently teaching."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'My Courses' }]}
      >
        {loading ? (
          <LmsSkeletonLoader type="courseGrid" count={3} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses created yet"
            description="Start building your syllabus and post lectures to your students."
            actionLabel="Create First Course"
            onAction={() => window.location.assign('/dashboard/teacher/courses/new')}
          />
        ) : (
          <div className="space-y-6">
            {/* Header Create Course trigger */}
            <div className="flex justify-end">
              <Link
                href="/dashboard/teacher/courses/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-400 transition"
              >
                <Plus className="h-4 w-4" />
                Add New Course
              </Link>
            </div>

            {/* Courses grid list */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => {
                const isPublished = course.status === 'published';
                return (
                  <div
                    key={course.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80 shadow-soft transition hover:border-violet-500/40 flex flex-col justify-between"
                  >
                    {/* Thumbnail banner */}
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

                    {/* Description content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{course.category}</p>
                        <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-normal">{course.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {course.curriculum?.length ?? 0} modules • ₹{course.price}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Publish button */}
                          <button
                            type="button"
                            onClick={() => togglePublish(course.id, !isPublished)}
                            className="rounded-lg p-1.5 text-slate-500 hover:text-white transition hover:bg-slate-900"
                            title={isPublished ? 'Switch to Draft' : 'Publish Course'}
                          >
                            {isPublished ? <EyeOff className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                          </button>

                          {/* Edit button */}
                          <Link
                            href={`/dashboard/teacher/courses/${course.id}/edit`}
                            className="rounded-lg p-1.5 text-slate-500 hover:text-violet-400 transition hover:bg-slate-900"
                            title="Edit Curriculum & Details"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${course.title}?`)) {
                                remove(course.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 transition hover:bg-slate-900"
                            title="Delete Course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
