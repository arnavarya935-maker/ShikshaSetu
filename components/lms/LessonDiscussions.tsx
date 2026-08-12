'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessagesSquare, ThumbsUp, Send, Reply, User as UserIcon } from 'lucide-react';
import { useAuth } from '../AuthProvider';
import { timeAgo } from '../../lib/lms/utils';

type ReplyType = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
};

type DiscussionComment = {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  replies: ReplyType[];
};

type LessonDiscussionsProps = {
  lessonId: string;
  courseId: string;
};

export default function LessonDiscussions({ lessonId, courseId }: LessonDiscussionsProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const currentUserInitials = useMemo(() => {
    if (profile?.name) return profile.name.substring(0, 2).toUpperCase();
    if (user?.displayName) return user.displayName.substring(0, 2).toUpperCase();
    return 'U';
  }, [profile, user]);

  const currentUserName = useMemo(() => {
    return profile?.name || user?.displayName || 'Student';
  }, [profile, user]);

  // Load comments from localStorage (or create mock ones for first visit)
  useEffect(() => {
    try {
      const storageKey = `discussions_${courseId}_${lessonId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        // Build premium default mock comments
        const defaults: DiscussionComment[] = [
          {
            id: `mock-1-${Date.now()}`,
            lessonId,
            userId: 'mock-user-1',
            userName: 'Aarav Sharma',
            userAvatar: 'AS',
            content: 'Could someone clarify the practical difference between this concept and what we learned in the previous module?',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
            upvotes: 4,
            upvotedBy: [],
            replies: [
              {
                id: `mock-reply-1-${Date.now()}`,
                userId: 'mock-user-2',
                userName: 'Ananya Iyer',
                userAvatar: 'AI',
                content: 'The key distinction is execution speed. The previous model handles simple routing, whereas this approach handles dynamic nested parameters.',
                createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
              }
            ]
          },
          {
            id: `mock-2-${Date.now()}`,
            lessonId,
            userId: 'mock-user-3',
            userName: 'Rahul Verma',
            userAvatar: 'RV',
            content: 'Are there any extra reading materials or docs for this specific lesson? The summary was great, but I want to dive deeper.',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
            upvotes: 2,
            upvotedBy: [],
            replies: []
          }
        ];
        setComments(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }
    } catch (e) {
      console.warn('Failed to load discussions from localStorage:', e);
    }
  }, [courseId, lessonId]);

  const saveToStorage = (updated: DiscussionComment[]) => {
    setComments(updated);
    try {
      localStorage.setItem(`discussions_${courseId}_${lessonId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save discussions:', e);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;

    const newComment: DiscussionComment = {
      id: `comment-${Date.now()}`,
      lessonId,
      userId: user.uid,
      userName: currentUserName,
      userAvatar: currentUserInitials,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      replies: []
    };

    saveToStorage([newComment, ...comments]);
    setNewCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim() || !user) return;

    const newReply: ReplyType = {
      id: `reply-${Date.now()}`,
      userId: user.uid,
      userName: currentUserName,
      userAvatar: currentUserInitials,
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });

    saveToStorage(updated);
    setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleUpvote = (commentId: string) => {
    if (!user) return;

    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        const hasUpvoted = comment.upvotedBy.includes(user.uid);
        const upvotedBy = hasUpvoted
          ? comment.upvotedBy.filter((uid) => uid !== user.uid)
          : [...comment.upvotedBy, user.uid];
        const upvotes = hasUpvoted ? comment.upvotes - 1 : comment.upvotes + 1;
        return {
          ...comment,
          upvotes,
          upvotedBy
        };
      }
      return comment;
    });

    saveToStorage(updated);
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/90 p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
        <MessagesSquare className="h-5 w-5 text-violet-400" />
        <h3 className="text-base font-bold text-white">Discussions & Doubts Forum</h3>
        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs text-slate-400 font-semibold">{comments.length}</span>
      </div>

      {/* New Question Form */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 text-xs font-bold text-white uppercase">
          {currentUserInitials}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Ask a question or post a doubt about this lesson..."
            className="flex-1 rounded-xl border border-slate-850 bg-slate-900/60 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 transition"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="rounded-xl bg-violet-500 px-4 py-2 text-white hover:bg-violet-400 transition disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-center text-xs text-slate-600 py-4">No discussions yet. Be the first to ask a question!</p>
        ) : (
          comments.map((comment) => {
            const hasUpvoted = user ? comment.upvotedBy.includes(user.uid) : false;
            return (
              <div key={comment.id} className="border-b border-slate-900/50 pb-5 last:border-0 last:pb-0 space-y-3">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-350 uppercase">
                    {comment.userAvatar}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{comment.userName}</span>
                      <span className="text-[10px] text-slate-500">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                    {/* Actions Row */}
                    <div className="flex items-center gap-4 pt-1">
                      <button
                        onClick={() => handleUpvote(comment.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold transition hover:text-white ${
                          hasUpvoted ? 'text-violet-400' : 'text-slate-500'
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${hasUpvoted ? 'fill-violet-400/20' : ''}`} />
                        <span>{comment.upvotes}</span>
                      </button>
                      <button
                        onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-white transition"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {activeReplyId === comment.id && (
                  <div className="ml-11 flex gap-2 pl-3 border-l border-slate-900">
                    <input
                      type="text"
                      value={replyTexts[comment.id] || ''}
                      onChange={(e) => setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })}
                      placeholder="Write a helpful response..."
                      className="flex-1 rounded-lg border border-slate-850 bg-slate-900/60 px-3 py-1.5 text-xs text-white placeholder-slate-650 outline-none focus:border-violet-500"
                    />
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!(replyTexts[comment.id] || '').trim()}
                      className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-400 transition disabled:opacity-40"
                    >
                      Post
                    </button>
                  </div>
                )}

                {/* Replies list */}
                {comment.replies.length > 0 && (
                  <div className="ml-11 pl-3 border-l border-slate-900 space-y-3 pt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-850 text-[10px] font-bold text-slate-400 uppercase">
                          {reply.userAvatar}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-slate-300">{reply.userName}</span>
                            <span className="text-slate-600">{timeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-450 leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
