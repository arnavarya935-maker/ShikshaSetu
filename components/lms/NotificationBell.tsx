'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import type { Notification } from '../../lib/lms/types';
import { timeAgo } from '../../lib/lms/utils';

type NotificationBellProps = {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
};

const typeColors: Record<string, string> = {
  enrollment: 'bg-indigo-500',
  completion: 'bg-emerald-500',
  assignment: 'bg-amber-500',
  quiz: 'bg-blue-500',
  certificate: 'bg-fuchsia-500',
  general: 'bg-slate-500',
};

export default function NotificationBell({ notifications, unreadCount, onMarkRead }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2.5 text-slate-600 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-soft"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-800/50 px-5 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-500 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={clsx(
                    'border-b border-slate-800/30 px-5 py-3.5 transition hover:bg-slate-900/50',
                    !notif.read && 'bg-violet-500/[0.03]'
                  )}
                >
                  {notif.linkUrl ? (
                    <Link
                      href={notif.linkUrl}
                      onClick={() => {
                        onMarkRead(notif.id);
                        setIsOpen(false);
                      }}
                      className="block"
                    >
                      <NotificationContent notif={notif} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => onMarkRead(notif.id)}
                      className="block w-full text-left"
                    >
                      <NotificationContent notif={notif} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationContent({ notif }: { notif: Notification }) {
  return (
    <div className="flex gap-3">
      <div className={clsx('mt-1 h-2 w-2 flex-shrink-0 rounded-full', !notif.read ? typeColors[notif.type] : 'bg-transparent')} />
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', notif.read ? 'text-slate-400' : 'text-white')}>
          {notif.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{notif.message}</p>
        <p className="mt-1 text-xs text-slate-600">{timeAgo(notif.createdAt)}</p>
      </div>
    </div>
  );
}
