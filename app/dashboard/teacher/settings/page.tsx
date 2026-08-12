'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Keyboard, Save } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';

export default function EducatorSettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [gradeNotif, setGradeNotif] = useState(true);
  const [discussionNotif, setDiscussionNotif] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Settings & Workspace Preferences"
        subtitle="Configure your dashboard workspaces, notifications alerts, and default credentials."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Settings' }]}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <DashboardCard
            title="Dashboard Settings"
            description="Manage settings to align with your grading and classroom workflows."
          >
            <div className="space-y-6 text-xs">
              {/* Notification Toggles */}
              <div className="space-y-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-900">
                  <Bell className="h-4 w-4 text-violet-400" />
                  Notifications & Bulletins
                </span>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Email updates</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Receive notifications when student registrations occur.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Assignment submissions</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Trigger notification badges for ungraded homework tasks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={gradeNotif}
                    onChange={(e) => setGradeNotif(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Discussion replies</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Receive alerts when students ask doubts in module lists.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={discussionNotif}
                    onChange={(e) => setDiscussionNotif(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>
              </div>

              {/* Privacy Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-900">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-900">
                  <Shield className="h-4 w-4 text-violet-400" />
                  Privacy & Professional Catalog
                </span>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Public profile listings</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Make your instructor bio visible to non-enrolled students.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>
              </div>

              {/* Save trigger */}
              <div className="flex justify-end pt-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-violet-400 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? 'Saving...' : success ? 'Preferences Saved ✓' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
