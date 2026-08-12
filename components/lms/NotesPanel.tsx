'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import type { Note } from '../../lib/lms/types';
import { timeAgo } from '../../lib/lms/utils';

type NotesPanelProps = {
  notes: Note[];
  lessonId: string;
  onSave: (content: string, existingNoteId?: string) => void;
  onDelete: (noteId: string) => void;
};

export default function NotesPanel({ notes, lessonId, onSave, onDelete }: NotesPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState('');

  const lessonNotes = notes.filter((n) => n.lessonId === lessonId);

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setDraftContent('');
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setIsAdding(false);
    setDraftContent(note.content);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setDraftContent('');
  };

  const save = () => {
    if (!draftContent.trim()) return;
    onSave(draftContent, editingId ?? undefined);
    cancel();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Notes ({lessonNotes.length})
        </p>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add note
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {(isAdding || editingId) && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 space-y-3">
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Write your note..."
            rows={3}
            className="w-full rounded-lg border border-slate-800/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none focus:border-violet-500"
            autoFocus
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!draftContent.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {lessonNotes.length === 0 && !isAdding && (
        <p className="text-center text-xs text-slate-600 py-4">No notes for this lesson yet.</p>
      )}

      {lessonNotes.map((note) => (
        <div
          key={note.id}
          className="group rounded-xl border border-slate-800/50 bg-slate-900/40 p-3 text-sm"
        >
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-600">{timeAgo(note.updatedAt)}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(note)}
                className="rounded-lg p-1 text-slate-500 hover:text-violet-400 transition"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="rounded-lg p-1 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
