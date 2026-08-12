'use client';

import { useMemo, useState } from 'react';
import { Search, UserCheck, UserMinus, Trash2, ShieldAlert } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAdminUsers } from '../../../../lib/lms/hooks-admin';
import { formatDate } from '../../../../lib/lms/utils';

export default function AdminStudentsPage() {
  const { users, loading, changeRole, toggleStatus, removeUser } = useAdminUsers();
  const [search, setSearch] = useState('');

  const students = useMemo(() => {
    return users.filter(
      (u) =>
        u.role === 'student' &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.institute.toLowerCase().includes(search.toLowerCase()))
    );
  }, [users, search]);

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Student Registration Roster"
        subtitle="Manage student account credentials, onboarding states, and platform logs."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Audit Students' }]}
      >
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by name, email, school..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-650 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Students list table */}
          {loading ? (
            <LmsSkeletonLoader type="courseGrid" count={3} />
          ) : (
            <DashboardCard
              title="Student Registrations"
              description={`Roster has logged ${students.length} student records.`}
            >
              {students.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No students found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">Student Profile</th>
                        <th className="py-3 px-4">Institute / School</th>
                        <th className="py-3 px-4">Registration Date</th>
                        <th className="py-3 px-4">State</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-xs text-slate-300">
                      {students.map((u) => {
                        const isSuspended = u.status === 'suspended';
                        return (
                          <tr key={u.uid} className="hover:bg-slate-900/20">
                            <td className="py-4 px-4 font-semibold text-white">
                              <p>{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                            </td>
                            <td className="py-4 px-4 truncate max-w-[200px]">
                              {u.institute || '-'}
                            </td>
                            <td className="py-4 px-4">
                              {formatDate(u.createdAt)}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                isSuspended 
                                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {/* Suspend toggle button */}
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(u.uid, u.status)}
                                  className={`rounded-lg p-1.5 border ${
                                    isSuspended 
                                      ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' 
                                      : 'border-rose-500/20 text-rose-300 hover:bg-rose-500/10'
                                  }`}
                                  title={isSuspended ? 'Reactivate Student' : 'Suspend Student'}
                                >
                                  {isSuspended ? <UserCheck className="h-4 w-4" /> : <UserMinus className="h-4 w-4" />}
                                </button>
                                
                                {/* Promote button to instructor */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Change role for ${u.name} to Teacher?`)) {
                                      changeRole(u.uid, 'teacher');
                                    }
                                  }}
                                  className="rounded-lg p-1.5 border border-slate-800 text-slate-450 hover:text-white transition"
                                  title="Promote to Instructor"
                                >
                                  Promote to Teacher
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardCard>
          )}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
