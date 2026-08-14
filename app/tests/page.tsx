'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockTests } from '../../lib/data/mockTests';
import { Play, Clock, Target, Filter } from 'lucide-react';
import Link from 'next/link';

export default function TestsDashboardPage() {
  const [selectedExam, setSelectedExam] = useState('All');

  const filteredTests = mockTests.filter(t => selectedExam === 'All' || t.exam === selectedExam);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 mt-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-rose-600 dark:text-rose-500">
            Mock Test Series
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Take exam-specific mock tests with real-time analytics to boost your score.
          </p>
        </header>

        <div className="flex justify-center md:justify-end mb-8">
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pl-12 text-sm outline-none transition focus:border-rose-500 appearance-none shadow-sm"
            >
              <option value="All">All Exams</option>
              <option value="JEE Main">JEE Main</option>
              <option value="NEET">NEET</option>
              <option value="CBSE">CBSE</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map(test => (
            <div key={test.id} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-soft flex flex-col hover:border-rose-300 dark:hover:border-rose-800 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md">
                  {test.exam}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                  {test.subject}
                </span>
              </div>
              <h3 className="font-bold text-xl leading-tight mb-4 text-slate-800 dark:text-zinc-100">{test.title}</h3>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-6 border-y border-slate-100 dark:border-zinc-800 py-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rose-400" />
                  {test.durationMinutes} Mins
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-400" />
                  {test.totalQuestions} Questions
                </div>
              </div>

              <Link href={`/tests/${test.id}`} className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors">
                <Play className="h-4 w-4" />
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
