"use client";
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type FaqItemProps = {
  question: string;
  answer: string;
};

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 py-5 transition-colors duration-200">
      <button 
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold text-zinc-900 dark:text-white transition hover:text-zinc-600 dark:hover:text-zinc-300"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-3">
          <ChevronRight className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${open ? 'rotate-90 text-zinc-900 dark:text-white' : ''}`} />
          {question}
        </span>
      </button>
      {open && (
        <p className="mt-3 pl-7 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 animate-in fade-in duration-200">
          {answer}
        </p>
      )}
    </div>
  );
}

