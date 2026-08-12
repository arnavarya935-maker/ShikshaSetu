'use client';

import { useState } from 'react';
import { Award, Calendar, CheckCircle2, ChevronRight, FileText, Send, User } from 'lucide-react';
import clsx from 'clsx';
import type { TeacherSubmission } from '../../lib/lms/data/submissions';
import { formatDate } from '../../lib/lms/utils';

type GradingPanelProps = {
  submissions: TeacherSubmission[];
  onGrade: (submissionId: string, score: number, feedback: string) => Promise<any>;
};

export default function GradingPanel({ submissions, onGrade }: GradingPanelProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ungraded' | 'graded'>('ungraded');

  // Grading states
  const [score, setScore] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredList = submissions.filter((s) => s.status === filter);
  const selectedSub = submissions.find((s) => s.id === selectedSubId);

  const handleSelect = (sub: TeacherSubmission) => {
    setSelectedSubId(sub.id);
    setScore(sub.score ?? '');
    setFeedback(sub.feedback ?? '');
  };

  const handleSubmitGrade = async () => {
    if (!selectedSub || score === '') return;
    if (score < 0 || score > (selectedSub as any).maxScore) {
      alert(`Score must be between 0 and ${(selectedSub as any).maxScore ?? 100}`);
      return;
    }

    setSubmitting(true);
    try {
      await onGrade(selectedSub.id, Number(score), feedback);
      setSelectedSubId(null);
      setScore('');
      setFeedback('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[340px_1fr]">
      {/* Submissions Sidebar List */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
        {/* Graded/Ungraded Toggle */}
        <div className="flex border-b border-slate-900 pb-2">
          <button
            onClick={() => {
              setFilter('ungraded');
              setSelectedSubId(null);
            }}
            className={clsx(
              'flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider transition',
              filter === 'ungraded' ? 'text-violet-300 border-b-2 border-violet-500' : 'text-slate-500'
            )}
          >
            Ungraded ({submissions.filter((s) => s.status === 'ungraded').length})
          </button>
          <button
            onClick={() => {
              setFilter('graded');
              setSelectedSubId(null);
            }}
            className={clsx(
              'flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider transition',
              filter === 'graded' ? 'text-violet-300 border-b-2 border-violet-500' : 'text-slate-500'
            )}
          >
            Graded ({submissions.filter((s) => s.status === 'graded').length})
          </button>
        </div>

        {/* Sidebar Scroll Area */}
        <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
          {filteredList.length === 0 ? (
            <p className="text-center text-xs text-slate-600 py-6">No submissions in queue.</p>
          ) : (
            filteredList.map((sub) => {
              const isSelected = sub.id === selectedSubId;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelect(sub)}
                  className={clsx(
                    'w-full rounded-xl border p-3 text-left transition',
                    isSelected
                      ? 'border-violet-500/40 bg-violet-500/10'
                      : 'border-slate-900 bg-slate-900/40 hover:border-slate-800'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{sub.studentName}</p>
                    <span className="text-[10px] text-slate-500">{formatDate(sub.submittedAt)}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mt-1 truncate">{sub.assignmentTitle}</p>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">{sub.courseTitle}</p>
                  {sub.score !== undefined && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-400">Score</span>
                      <span className="text-xs text-emerald-300 font-bold">{sub.score} points</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between min-h-[400px]">
        {!selectedSub ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <FileText className="h-10 w-10 text-slate-600" />
            <p className="mt-4 text-sm text-slate-400">Select a student submission from the queue to start grading.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{selectedSub.courseTitle}</p>
                <h3 className="text-base font-bold text-white">{selectedSub.assignmentTitle}</h3>
                
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{selectedSub.studentName} ({selectedSub.studentEmail})</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Submitted {formatDate(selectedSub.submittedAt)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
                Max Score: <span className="font-bold text-white">{(selectedSub as any).maxScore ?? 100} pts</span>
              </div>
            </div>

            {/* Submission Content Box */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Submission:</span>
              <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedSub.content}
              </div>
            </div>

            {/* Grading Form */}
            <div className="pt-4 border-t border-slate-900 space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Grading Panel</span>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Score Out of {(selectedSub as any).maxScore ?? 100}</label>
                  <input
                    type="number"
                    min="0"
                    max={(selectedSub as any).maxScore ?? 100}
                    value={score}
                    onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Score"
                    className="w-full rounded-xl border border-slate-850 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Feedback Comments</label>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter written feedback for the student..."
                    className="w-full rounded-xl border border-slate-850 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmitGrade}
                  disabled={score === '' || submitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-400 transition disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Submitting...' : selectedSub.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
