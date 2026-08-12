'use client';

import { FileText, ExternalLink, Download, Link2 } from 'lucide-react';
import type { Resource } from '../../lib/lms/types';

type ResourceListProps = {
  resources: Resource[];
};

const typeIcons = {
  pdf: FileText,
  doc: FileText,
  link: Link2,
  video: ExternalLink,
};

const typeLabels = {
  pdf: 'PDF',
  doc: 'Document',
  link: 'Link',
  video: 'Video',
};

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <p className="text-center text-xs text-slate-600 py-4">No resources for this lesson.</p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
        Resources ({resources.length})
      </p>
      {resources.map((resource) => {
        const Icon = typeIcons[resource.type] ?? FileText;
        return (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-800/50 bg-slate-900/40 px-4 py-3 text-sm transition hover:border-violet-500/40 hover:bg-slate-900/60"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800/60">
              <Icon className="h-4 w-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{resource.title}</p>
              <p className="text-xs text-slate-500">{typeLabels[resource.type]}</p>
            </div>
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-600" />
          </a>
        );
      })}
    </div>
  );
}
