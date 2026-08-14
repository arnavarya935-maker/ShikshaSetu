'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockPapers } from '../../lib/data/mockPapers';
import { Download, Search, Filter } from 'lucide-react';

export default function PapersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All');

  const filteredPapers = mockPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = selectedBoard === 'All' || paper.board === selectedBoard;
    return matchesSearch && matchesBoard;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 mt-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-rose-600 dark:text-rose-500">
            Past Papers Library
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Access thousands of previous year question papers for boards and competitive exams.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map(paper => (
            <div key={paper.id} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md">
                    {paper.board}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">{paper.year}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2 text-slate-800 dark:text-zinc-100">{paper.title}</h3>
                <p className="text-xs text-zinc-500 mb-4">{paper.subject}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold">{paper.downloads.toLocaleString()} Downloads</span>
                <button className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition">
                  <Download className="h-4 w-4" />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
        
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
