'use client';

import { useState } from 'react';
import { getFirebaseFirestore } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ArrowUpRight } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setSubmitting(true);
    try {
      const db = getFirebaseFirestore();
      if (db) {
        await addDoc(collection(db, 'newsletter'), {
          email: email.trim(),
          subscribedAt: new Date().toISOString(),
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to save newsletter subscription to Firestore:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-[#2F7D5A] px-4 py-1.5 text-xs font-mono font-medium tracking-[0.2em] uppercase !text-white">
          <span>✦ SUBSCRIBED</span>
        </div>
        <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white sm:text-4xl">Welcome to the inner circle! 🎉</h3>
        <p className="max-w-xl mx-auto text-sm text-zinc-600 dark:text-zinc-400">
          We have registered <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>. You will receive exclusive learning updates as new features launch.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3.5 py-1.5 text-xs font-mono font-medium tracking-[0.18em] uppercase text-zinc-700 dark:text-zinc-300">
          <span>✦ STAY INFORMED</span>
        </div>
        <h3 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Start Using Your AI Learning Assistant Today
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Receive updates, specialized study prompts, and personalized learning features directly in your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none shadow-none transition focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex shrink-0 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-6 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-60"
        >
          <span>Subscribe</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}


