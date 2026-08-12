'use client';

import DashboardShell from './DashboardShell';
import DashboardCard from './DashboardCard';
import DashboardActions from './DashboardActions';
import { useAuth } from './AuthProvider';

type DashboardRoutePlaceholderProps = {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  actionItems?: Array<{ label: string; description: string }>;
  children?: React.ReactNode;
};

export default function DashboardRoutePlaceholder({ title, description, breadcrumbs, actionItems = [], children }: DashboardRoutePlaceholderProps) {
  const { profile } = useAuth();

  return (
    <DashboardShell title={title} subtitle={description} breadcrumbs={breadcrumbs}>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        <div className="space-y-6">
          <DashboardCard title={title} description={description}>
            <div className="space-y-4 text-sm text-slate-300">
              <p>This page is a placeholder for the {title.toLowerCase()} experience. It keeps the layout consistent while your LMS features are being built.</p>
              {children}
            </div>
          </DashboardCard>

          {actionItems.length ? (
            <DashboardCard title="Quick actions" description="Useful next steps for this section.">
              <DashboardActions items={actionItems} />
            </DashboardCard>
          ) : null}
        </div>

        <div className="space-y-6">
          <DashboardCard title="Your profile" description="Role and affiliation information.">
            <div className="space-y-3 text-sm text-slate-300">
              <p><span className="font-semibold text-slate-100">Name:</span> {profile?.name}</p>
              <p><span className="font-semibold text-slate-100">Institute:</span> {profile?.institute}</p>
              <p><span className="font-semibold text-slate-100">Role:</span> {profile?.role}</p>
            </div>
          </DashboardCard>

          <DashboardCard title="Empty state" description="Guidance for when data is not available yet.">
            <p className="text-sm text-slate-400">No live content has been published here yet. Use the links in the sidebar to explore other LMS sections.</p>
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
