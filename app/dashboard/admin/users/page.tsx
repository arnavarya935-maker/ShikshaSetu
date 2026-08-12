'use client';

import { useMemo, useState } from 'react';
import { Shield, Search, Filter, UserCheck, UserMinus, Trash2, Mail, Award } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAdminUsers } from '../../../../lib/lms/hooks-admin';
import { formatDate } from '../../../../lib/lms/utils';

export default function AdminUsersPage() {
  const { users, loading, changeRole, toggleStatus, removeUser } = useAdminUsers();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.institute.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Auditing & User Credentials"
        subtitle="Manage accounts, change roles, or toggle suspension states."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Audit Users' }]}
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
                placeholder="Search user name, email, institute..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-650 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-850 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Platform Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <LmsSkeletonLoader type="courseGrid" count={3} />
          ) : (
            <DashboardCard
              title="Registered Accounts"
              description={`Auditing ${filteredUsers.length} user records.`}
            >
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No users match your criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Institute</th>
                        <th className="py-3 px-4">Role Credentials</th>
                        <th className="py-3 px-4">Onboarding</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-xs text-slate-300">
                      {filteredUsers.map((u) => {
                        const isSuspended = u.status === 'suspended';
                        return (
                          <tr key={u.uid} className="hover:bg-slate-900/20">
                            <td className="py-4 px-4 font-semibold text-white">
                              <p>{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                            </td>
                            <td className="py-4 px-4 truncate max-w-[150px]">
                              {u.institute || '-'}
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={u.role}
                                onChange={(e) => changeRole(u.uid, e.target.value as any)}
                                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:border-violet-500 outline-none"
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                u.onboardingComplete 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              }`}>
                                {u.onboardingComplete ? 'Complete' : 'Pending'}
                              </span>
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
                                  title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                >
                                  {isSuspended ? <UserCheck className="h-4 w-4" /> : <UserMinus className="h-4 w-4" />}
                                </button>
                                
                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to permanently delete user ${u.name}?`)) {
                                      removeUser(u.uid);
                                    }
                                  }}
                                  className="rounded-lg p-1.5 border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                                  title="Delete User Record"
                                >
                                  <Trash2 className="h-4 w-4" />
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
