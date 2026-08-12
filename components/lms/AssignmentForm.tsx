'use client';

import { useState } from 'react';
import { Upload, Send, Calendar, Award } from 'lucide-react';
import type { Assignment } from '../../lib/lms/types';
import { formatDate } from '../../lib/lms/utils';

type AssignmentFormProps = {
  assignment: Assignment;
  onSubmit?: (content: string) => void;
};

export default function AssignmentForm({ assignment, onSubmit }: AssignmentFormProps) {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit?.(content);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <Send className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Assignment Submitted!</h3>
        <p className="mt-2 text-sm text-slate-400">
          Your submission for &quot;{assignment.title}&quot; has been received. You&apos;ll be notified when it&apos;s graded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Assignment</p>
        <h3 className="mt-2 text-lg font-semibold text-white">{assignment.title}</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{assignment.description}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-slate-400">Due:</span>
          <span className="font-medium text-white">{formatDate(assignment.dueDate)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm">
          <Award className="h-4 w-4 text-slate-500" />
          <span className="text-slate-400">Max score:</span>
          <span className="font-medium text-white">{assignment.maxScore} points</span>
        </div>
      </div>

      {/* Submission area */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Your submission</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your answer here, or paste a link to your work..."
          rows={6}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-800 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed opacity-50"
        >
          <Upload className="h-4 w-4" />
          Attach file (coming soon)
        </button>

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Submit Assignment
        </button>
      </div>
    </div>
  );
}
