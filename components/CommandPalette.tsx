'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Settings, BookOpen, FileText, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { profile } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const items = [
    { name: 'Dashboard', icon: LayoutDashboard, href: `/dashboard/${profile?.role || 'student'}` },
    { name: 'Courses', icon: BookOpen, href: '/courses' },
    { name: 'Past Papers', icon: FileText, href: '/papers' },
    { name: 'Profile', icon: User, href: `/dashboard/${profile?.role || 'student'}/profile` },
    { name: 'Settings', icon: Settings, href: `/dashboard/${profile?.role || 'student'}/settings` },
  ];

  const filteredItems = search
    ? items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
            <Search className="h-5 w-5 text-zinc-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search or jump to..."
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
                if (e.key === 'Enter' && filteredItems.length > 0) {
                  router.push(filteredItems[0].href);
                  setIsOpen(false);
                }
              }}
            />
            <span className="text-[10px] font-medium text-zinc-400 uppercase border border-zinc-200 dark:border-zinc-800 rounded px-1.5 py-0.5">ESC</span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <p className="p-4 text-center text-sm text-zinc-500">No results found.</p>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      router.push(item.href);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-zinc-400" />
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
