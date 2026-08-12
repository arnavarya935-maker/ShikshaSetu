'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Read the actual class set by the blocking script in layout.tsx
    const isDark = document.documentElement.classList.contains('dark');
    setMode(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem('theme', next);
    } catch (e) {
      console.warn('Failed to save theme in LocalStorage:', e);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2.5 text-slate-600 dark:text-slate-200 transition hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-soft flex items-center justify-center"
      aria-label="Toggle theme mode"
    >
      {mode === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-500" />
      )}
    </button>
  );
}
