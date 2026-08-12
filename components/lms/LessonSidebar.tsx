'use client';

import { useState } from 'react';
import { BookOpen, FileText, Bookmark as BookmarkIcon } from 'lucide-react';
import clsx from 'clsx';
import CurriculumAccordion from './CurriculumAccordion';
import NotesPanel from './NotesPanel';
import ResourceList from './ResourceList';
import ProgressBar from './ProgressBar';
import type { Module, Note, Resource, Bookmark } from '../../lib/lms/types';

type Tab = 'curriculum' | 'notes' | 'resources' | 'bookmarks';

type LessonSidebarProps = {
  curriculum: Module[];
  completedLessons: string[];
  currentLessonId: string;
  progress: number;
  notes: Note[];
  currentResources: Resource[];
  bookmarks: Bookmark[];
  onLessonClick: (lessonId: string) => void;
  onSaveNote: (content: string, existingNoteId?: string) => void;
  onDeleteNote: (noteId: string) => void;
};

const tabs: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: 'curriculum', label: 'Lessons', Icon: BookOpen },
  { key: 'notes', label: 'Notes', Icon: FileText },
  { key: 'resources', label: 'Resources', Icon: FileText },
  { key: 'bookmarks', label: 'Saved', Icon: BookmarkIcon },
];

export default function LessonSidebar({
  curriculum,
  completedLessons,
  currentLessonId,
  progress,
  notes,
  currentResources,
  bookmarks,
  onLessonClick,
  onSaveNote,
  onDeleteNote,
}: LessonSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('curriculum');

  return (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
      {/* Progress */}
      <div className="border-b border-slate-800/50 p-5">
        <ProgressBar value={progress} size="sm" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium transition',
              activeTab === tab.key
                ? 'border-b-2 border-violet-500 text-violet-300'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <tab.Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'curriculum' && (
          <CurriculumAccordion
            curriculum={curriculum}
            completedLessons={completedLessons}
            currentLessonId={currentLessonId}
            onLessonClick={onLessonClick}
            interactive
          />
        )}

        {activeTab === 'notes' && (
          <NotesPanel
            notes={notes}
            lessonId={currentLessonId}
            onSave={onSaveNote}
            onDelete={onDeleteNote}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceList resources={currentResources} />
        )}

        {activeTab === 'bookmarks' && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Bookmarked Lessons ({bookmarks.length})
            </p>
            {bookmarks.length === 0 ? (
              <p className="text-center text-xs text-slate-600 py-4">No bookmarks yet.</p>
            ) : (
              bookmarks.map((bm) => (
                <button
                  key={bm.id}
                  onClick={() => onLessonClick(bm.lessonId)}
                  className="block w-full rounded-xl border border-slate-800/50 bg-slate-900/40 p-3 text-left text-sm transition hover:border-violet-500/30"
                >
                  <p className="font-medium text-slate-200 truncate">{bm.lessonTitle}</p>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">{bm.courseTitle}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
