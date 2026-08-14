'use client';

import React from 'react';
import { Target } from 'lucide-react';

// A GitHub-style contribution grid component for Subject Mastery
export default function MasteryHeatmap() {
  // Generate mock data for 12 weeks, 7 days a week
  const weeks = 12;
  const daysPerWeek = 7;
  
  const generateMockData = () => {
    const data = [];
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysPerWeek; d++) {
        // Random intensity 0-4
        week.push(Math.floor(Math.random() * 5));
      }
      data.push(week);
    }
    return data;
  };

  const mechanicsData = generateMockData();
  const algebraData = generateMockData();
  const biologyData = generateMockData();

  const renderGrid = (data: number[][]) => {
    return (
      <div className="flex gap-1">
        {data.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((intensity, dIdx) => {
              let bg = 'bg-slate-100 dark:bg-zinc-800';
              if (intensity === 1) bg = 'bg-rose-200 dark:bg-rose-900/40';
              if (intensity === 2) bg = 'bg-rose-300 dark:bg-rose-700/60';
              if (intensity === 3) bg = 'bg-rose-500 dark:bg-rose-600';
              if (intensity === 4) bg = 'bg-rose-600 dark:bg-rose-500';
              
              return (
                <div 
                  key={dIdx} 
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[2px] sm:rounded-sm ${bg} hover:ring-2 hover:ring-rose-400 transition-all cursor-crosshair`}
                  title={`Mastery Score: ${intensity}/4`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-soft w-full">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Target className="h-5 w-5 text-rose-500" /> Subject Mastery Heatmap
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Track your consistency and topic strength over the last 12 weeks.</p>
        </div>
      </div>

      <div className="space-y-6 overflow-x-auto pb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Physics: Mechanics</h4>
          {renderGrid(mechanicsData)}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Math: Algebra</h4>
          {renderGrid(algebraData)}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Biology: Genetics</h4>
          {renderGrid(biologyData)}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-500">
        <span>Weak</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-zinc-800" />
          <div className="w-3 h-3 rounded-[2px] bg-rose-200 dark:bg-rose-900/40" />
          <div className="w-3 h-3 rounded-[2px] bg-rose-300 dark:bg-rose-700/60" />
          <div className="w-3 h-3 rounded-[2px] bg-rose-500 dark:bg-rose-600" />
          <div className="w-3 h-3 rounded-[2px] bg-rose-600 dark:bg-rose-500" />
        </div>
        <span>Strong</span>
      </div>
    </div>
  );
}
