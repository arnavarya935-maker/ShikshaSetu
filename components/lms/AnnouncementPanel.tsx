'use client';

import { useState } from 'react';
import { Megaphone, Plus, Trash2, Send, X, Calendar } from 'lucide-react';
import type { Announcement } from '../../lib/lms/data/announcements';
import { timeAgo } from '../../lib/lms/utils';

type AnnouncementPanelProps = {
  announcements: Announcement[];
  onAddAnnouncement: (title: string, message: string) => Promise<any>;
};

export default function AnnouncementPanel({ announcements, onAddAnnouncement }: AnnouncementPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await onAddAnnouncement(title, message);
      setTitle('');
      setMessage('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4.5 w-4.5 text-violet-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Announcements</span>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300"
          >
            <Plus className="h-3.5 w-3.5" />
            New Post
          </button>
        )}
      </div>

      {/* Expandable Form */}
      {isAdding && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.02] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Broadcast Announcement</span>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. extension of task deadline..."
                className="w-full rounded-xl border border-slate-850 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Detailed Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details here..."
                rows={4}
                className="w-full rounded-xl border border-slate-850 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handlePost}
                disabled={!title.trim() || !message.trim() || submitting}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-400 transition disabled:opacity-40"
              >
                <Send className="h-3 w-3" />
                {submitting ? 'Broadcasting...' : 'Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-center text-xs text-slate-600 py-6">No announcements published.</p>
        ) : (
          announcements.map((ann) => (
            <article
              key={ann.id}
              className="rounded-2xl border border-slate-900 bg-slate-900/20 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white leading-snug">{ann.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{ann.courseTitle}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-600" />
                  {timeAgo(ann.createdAt)}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.message}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
