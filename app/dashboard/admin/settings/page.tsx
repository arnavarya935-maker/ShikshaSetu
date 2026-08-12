'use client';

import { useEffect, useState } from 'react';
import { Settings, Shield, Bell, Database, Save, Check } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [allowTeacherSignup, setAllowTeacherSignup] = useState(true);
  const [diagnosticLogs, setDiagnosticLogs] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMaintenance = localStorage.getItem('setting_maintenanceMode');
        const savedReg = localStorage.getItem('setting_allowRegistration');
        const savedTeacher = localStorage.getItem('setting_allowTeacherSignup');
        const savedLogs = localStorage.getItem('setting_diagnosticLogs');

        if (savedMaintenance !== null) setMaintenanceMode(savedMaintenance === 'true');
        if (savedReg !== null) setAllowRegistration(savedReg === 'true');
        if (savedTeacher !== null) setAllowTeacherSignup(savedTeacher === 'true');
        if (savedLogs !== null) setDiagnosticLogs(savedLogs === 'true');
      } catch (e) {
        console.warn('Failed to read settings from LocalStorage:', e);
      }
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setSuccess(false);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('setting_maintenanceMode', String(maintenanceMode));
        localStorage.setItem('setting_allowRegistration', String(allowRegistration));
        localStorage.setItem('setting_allowTeacherSignup', String(allowTeacherSignup));
        localStorage.setItem('setting_diagnosticLogs', String(diagnosticLogs));
      } catch (e) {
        console.warn('Failed to save settings to LocalStorage:', e);
      }
    }

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardShell
        title="Global Platform Settings"
        subtitle="Manage ShikshaSetu application hosting options and security parameters."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Settings' }]}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <DashboardCard
            title="System Preferences"
            description="Manage parameters affecting user onboarding and database configurations."
          >
            <div className="space-y-6 text-xs">
              {/* Security parameters */}
              <div className="space-y-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-900">
                  <Shield className="h-4 w-4 text-violet-400" />
                  Access & Registrations
                </span>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Global registrations</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Permit new student account signups.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Educator onboarding</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Permit verified teacher registrations.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowTeacherSignup}
                    onChange={(e) => setAllowTeacherSignup(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>
              </div>

              {/* Server Diagnostics */}
              <div className="space-y-3 pt-3 border-t border-slate-900">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-900">
                  <Database className="h-4 w-4 text-violet-400" />
                  Hosting & Maintenance Mode
                </span>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Maintenance mode</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Route non-admin users to platform maintenance template.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-white">Enable diagnostic log collection</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Log query warnings and dashboard latency rates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={diagnosticLogs}
                    onChange={(e) => setDiagnosticLogs(e.target.checked)}
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
                  {saving ? 'Saving...' : success ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Preferences Saved
                    </>
                  ) : 'Save Preferences'}
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
