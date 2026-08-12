'use client';

import { useState } from 'react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import { useAuth } from '../../../../components/AuthProvider';
import { useLanguage } from '../../../../lib/language/LanguageContext';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../../lib/firebase';
import { Bell, Globe, Shield, Loader2, Sparkles } from 'lucide-react';

type SettingsState = {
  emailUpdates: boolean;
  appNotifications: boolean;
  weeklyReport: boolean;
  publicLeaderboard: boolean;
  showInstitute: boolean;
};

export default function StudentSettingsPage() {
  const { user, profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Load existing settings if stored, otherwise default
  const defaultSettings: SettingsState = (profile as any)?.settings ?? {
    emailUpdates: true,
    appNotifications: true,
    weeklyReport: false,
    publicLeaderboard: true,
    showInstitute: true,
  };

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setToast(null);

    const db = getFirebaseFirestore();
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          settings,
          onboardingComplete: true,
        }, { merge: true });

        setToast('✅ Settings saved successfully!');
        setTimeout(() => setToast(null), 2500);
      } catch (err) {
        console.error('Failed to save settings:', err);
        setToast('❌ Failed to save settings. Please try again.');
      } finally {
        setSaving(false);
      }
    } else {
      setToast('❌ Database connection error.');
      setSaving(false);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="Settings"
        subtitle="Manage notifications, translations, and privacy preferences."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Settings' }
        ]}
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {toast && (
            <div className="rounded-2xl border border-violet-500/30 bg-slate-900 px-6 py-4 text-sm font-semibold text-violet-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {toast}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Language Selection */}
            <DashboardCard title="Language & Locale" description="Choose your preferred language for the ShikshaSetu dashboard.">
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <Globe className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Interface Language</p>
                    <p className="text-xs text-slate-500">Switch dashboard translations instantly.</p>
                  </div>
                </div>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  className="rounded-xl border border-slate-850 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-violet-500"
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </DashboardCard>

            {/* Notification Preferences */}
            <DashboardCard title="Notifications" description="Choose when and how you want to be notified.">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">Email Updates</p>
                      <p className="text-xs text-slate-500">Receive weekly emails about your progress and courses.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={() => handleToggle('emailUpdates')}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-500 focus:ring-violet-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">In-App Alerts</p>
                      <p className="text-xs text-slate-500">Receive browser alerts for comments and study reminders.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appNotifications}
                    onChange={() => handleToggle('appNotifications')}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-500 focus:ring-violet-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">Weekly Performance Report</p>
                      <p className="text-xs text-slate-500">Get an automated summary of study hours and quiz performance.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReport}
                    onChange={() => handleToggle('weeklyReport')}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-500 focus:ring-violet-500 cursor-pointer"
                  />
                </div>
              </div>
            </DashboardCard>

            {/* Privacy Controls */}
            <DashboardCard title="Privacy" description="Configure your public profile visibility preferences.">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">Public Leaderboard Visibility</p>
                      <p className="text-xs text-slate-500">Show your profile ranking and score to other students.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.publicLeaderboard}
                    onChange={() => handleToggle('publicLeaderboard')}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-500 focus:ring-violet-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">Show Institute on Public Leaderboards</p>
                      <p className="text-xs text-slate-500">Display your school or university name next to your avatar.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showInstitute}
                    onChange={() => handleToggle('showInstitute')}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-500 focus:ring-violet-500 cursor-pointer"
                  />
                </div>
              </div>
            </DashboardCard>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
