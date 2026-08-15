'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockPapers } from '../../lib/data/mockPapers';
import { Download, Search, Filter, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PapersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All');

  const filteredPapers = mockPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = selectedBoard === 'All' || paper.board === selectedBoard;
    return matchesSearch && matchesBoard;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090505] text-slate-900 dark:text-zinc-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 mt-16 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen className="h-4 w-4" /> Comprehensive Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Past Papers <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Library</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Access thousands of previous year question papers for boards and competitive exams.
          </p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by subject or exam title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pl-12 text-sm outline-none transition focus:border-rose-500"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pl-12 text-sm outline-none transition focus:border-rose-500 appearance-none"
            >
              <option value="All">All Boards / Exams</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPapers.map((paper, idx) => (
            <motion.div 
              key={paper.id}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => window.open(paper.pdfUrl, '_blank')}
              className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-soft hover:shadow-elevated hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-100 dark:border-rose-500/20">
                    {paper.board}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">{paper.year}</span>
                </div>
                <h3 className="font-extrabold text-lg leading-snug mb-2 text-slate-800 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{paper.title}</h3>
                <p className="text-xs font-semibold text-zinc-500 mb-4">{paper.subject}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/60">
                <span className="text-[10px] text-zinc-400 font-semibold">{paper.downloads.toLocaleString()} Downloads</span>
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition">
                  <Download className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                  PDF
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredPapers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">No past papers found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
