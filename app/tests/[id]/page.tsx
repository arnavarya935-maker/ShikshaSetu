'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockTests } from '../../../lib/data/mockTests';
import TestResults from '../../../components/lms/TestResults';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ActiveTestPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const test = mockTests.find(t => t.id === id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Overall timer
  const [timeLeft, setTimeLeft] = useState((test?.durationMinutes || 0) * 60);

  useEffect(() => {
    if (!test || isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
      
      // Question-wise timer
      setTimeSpent(prev => ({
        ...prev,
        [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [test, isSubmitted, currentQuestionIndex]);

  if (!test) {
    return <div className="p-10 text-center">Test not found.</div>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qIndex: number, oIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 sm:p-10">
        <TestResults test={test} answers={answers} timeSpent={timeSpent} onBack={() => router.push('/tests')} />
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      {/* Top Bar */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-white">{test.title}</h1>
          <p className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wider">QUESTION {currentQuestionIndex + 1} OF {test.totalQuestions}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col">
        
        {/* Question Area */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-soft mb-6 flex-1">
          <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-zinc-100 mb-8 leading-relaxed">
            <span className="text-rose-500 mr-2">Q{currentQuestionIndex + 1}.</span> 
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestionIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestionIndex, idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' 
                      : 'border-slate-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-800'
                  }`}
                >
                  <div className={`flex items-center justify-center h-6 w-6 rounded-full border-2 text-xs font-bold ${
                    isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300 dark:border-zinc-700 text-zinc-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-sm sm:text-base ${isSelected ? 'text-rose-700 dark:text-rose-300 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}>
                    {opt}
                  </span>
                  {isSelected && <CheckCircle2 className="h-5 w-5 ml-auto text-rose-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" /> Previous
          </button>
          
          <div className="flex gap-2 overflow-x-auto px-4 max-w-[50%]">
            {test.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  currentQuestionIndex === idx 
                    ? 'bg-rose-600 text-white shadow-md'
                    : answers[idx] !== undefined
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-zinc-800 text-zinc-500 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(test.totalQuestions - 1, prev + 1))}
            disabled={currentQuestionIndex === test.totalQuestions - 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
