'use client';

import React from 'react';
import { PieChart } from 'lucide-react';

export default function TimeTracker() {
  const data = [
    { subject: 'Physics', hours: 14.5, color: 'bg-indigo-500' },
    { subject: 'Chemistry', hours: 10.2, color: 'bg-pink-500' },
    { subject: 'Mathematics', hours: 18.0, color: 'bg-rose-500' },
    { subject: 'Biology', hours: 5.5, color: 'bg-emerald-500' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-soft w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-indigo-500" /> Weekly Time Spent
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Progress Bar Stack */}
        <div className="w-full h-4 rounded-full overflow-hidden flex mb-8">
          {data.map((item, idx) => (
            <div 
              key={idx}
              className={`h-full ${item.color} transition-all duration-1000`}
              style={{ width: `${(item.hours / total) * 100}%` }}
              title={`${item.subject}: ${item.hours} hrs`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, idx) => {
            const percentage = Math.round((item.hours / total) * 100);
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-200 leading-none">{item.subject}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">{item.hours}h ({percentage}%)</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
