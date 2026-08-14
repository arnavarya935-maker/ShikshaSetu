'use client';

import React from 'react';
import { MockTest } from '../../../lib/data/mockTests';
import { CheckCircle2, XCircle, Clock, ArrowLeft, Trophy } from 'lucide-react';

type TestResultsProps = {
  test: MockTest;
  answers: Record<number, number>;
  timeSpent: Record<number, number>;
  onBack: () => void;
};

export default function TestResults({ test, answers, timeSpent, onBack }: TestResultsProps) {
  let score = 0;
  test.questions.forEach((q, idx) => {
    if (answers[idx] === q.correctAnswerIndex) {
      score++;
    }
  });

  const percentage = Math.round((score / test.totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Test Results: {test.title}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-soft flex flex-col items-center justify-center text-center">
          <Trophy className={`h-16 w-16 mb-4 ${percentage >= 75 ? 'text-emerald-500' : percentage >= 50 ? 'text-yellow-500' : 'text-rose-500'}`} />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Final Score</p>
          <p className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">{score} <span className="text-2xl text-zinc-400">/ {test.totalQuestions}</span></p>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full rounded-full ${percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-rose-500'}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs font-semibold mt-3 text-zinc-500">{percentage}% Accuracy</p>
        </div>

        {/* Analytics Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-soft">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Question-Wise Time Analytics
          </h3>
          
          <div className="space-y-4">
            {test.questions.map((q, idx) => {
              const time = timeSpent[idx] || 0;
              const isCorrect = answers[idx] === q.correctAnswerIndex;
              const isUnanswered = answers[idx] === undefined;
              
              // Normalize bar width (max 60 seconds for visual scaling)
              const barWidth = Math.min(100, Math.max(5, (time / 60) * 100));

              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-8 shrink-0 flex justify-center">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : isUnanswered ? <span className="text-xs font-bold text-zinc-400">-</span> : <XCircle className="h-5 w-5 text-rose-500" />}
                  </div>
                  <div className="text-xs font-bold text-zinc-500 w-8 shrink-0">Q{idx + 1}</div>
                  
                  <div className="flex-1 relative h-6 bg-slate-100 dark:bg-zinc-800 rounded-md overflow-hidden flex items-center">
                    <div 
                      className={`h-full rounded-md transition-all ${time > 45 ? 'bg-rose-400' : time > 20 ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="w-16 shrink-0 text-right text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
                    {time}s
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 mt-6 text-center italic">Color intensity indicates time spent (Green: Fast, Red: Slow)</p>
        </div>
      </div>
    </div>
  );
}
