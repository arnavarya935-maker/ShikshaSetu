'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockTests } from '../../lib/data/mockTests';
import { Play, Clock, Target, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TestsDashboardPage() {
  const [selectedExam, setSelectedExam] = useState('All');

  const filteredTests = mockTests.filter(t => selectedExam === 'All' || t.exam === selectedExam);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090505] text-slate-900 dark:text-zinc-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 mt-16 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Target className="h-4 w-4" /> Assessment Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Mock Test <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Series</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Take exam-specific mock tests with real-time analytics to boost your score.
          </p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center md:justify-end mb-12"
        >
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTests.map((test, idx) => (
            <motion.div 
              key={test.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-soft flex flex-col hover:shadow-elevated hover:border-rose-300 dark:hover:border-rose-800 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-100 dark:border-rose-500/20">
                  {test.exam}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                  {test.subject}
                </span>
              </div>
              <h3 className="font-extrabold text-xl leading-snug mb-4 text-slate-800 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{test.title}</h3>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-6 border-y border-slate-100 dark:border-zinc-800/60 py-4">
                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded text-rose-600 dark:text-rose-400">
                  <Clock className="h-3.5 w-3.5" />
                  {test.durationMinutes} Mins
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400">
                  <Target className="h-3.5 w-3.5" />
                  {test.totalQuestions} Questions
                </div>
              </div>

              <Link href={`/tests/${test.id}`} className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-glow hover:shadow-none">
                <Play className="h-4 w-4" />
                Start Test
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
