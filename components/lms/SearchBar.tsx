'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LogoIcon } from '../Logo';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search courses, topics, instructors...',
  debounceMs = 300,
}: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = useCallback(
    (v: string) => {
      setLocal(v);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), debounceMs);
    },
    [onChange, debounceMs]
  );

  const clear = () => {
    setLocal('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <LogoIcon className="h-5 w-5" />
      </div>

      <input
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 py-3.5 pl-12 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
      />
      {local && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
