'use client';

import DashboardShell from './DashboardShell';

type DashboardPlaceholderProps = {
  title: string;
  subtitle: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
};

export default function DashboardPlaceholder({ title, subtitle, breadcrumbs, mainContent, sideContent }: DashboardPlaceholderProps) {
  return (
    <DashboardShell title={title} subtitle={subtitle} breadcrumbs={breadcrumbs}>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">{mainContent}</div>
        {sideContent ? <div className="space-y-6">{sideContent}</div> : null}
      </div>
    </DashboardShell>
  );
}
