'use client';

import { useState } from 'react';
import { CalendarDays, Sparkles, RefreshCw, CheckSquare } from 'lucide-react';
import { generateStudyPlan } from '../../lib/ai/client';

type PlanItem = {
  week: string;
  title: string;
  tasks: string[];
};

export default function AiStudyPlanner() {
  const [courseTitle, setCourseTitle] = useState('');
  const [days, setDays] = useState(30);
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanItem[]>([]);

  const handleGenerate = async () => {
    if (!courseTitle.trim()) return;
    setLoading(true);
    setPlan([]);

    try {
      const data = await generateStudyPlan(courseTitle, days, hours);
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Parameter input */}
      <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 space-y-4 self-start shadow-soft">
        <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-zinc-800 pb-3">
          <CalendarDays className="h-4 w-4 text-zinc-900 dark:text-white" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">AI Study Calendar Planner</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Plan your upcoming study sprints dynamically. Select study timelines and target daily hours commitment to compile weekly task targets.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Subject / Target Course</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. Master React, UI design fundamentals..."
              className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Study Timeline (Days)</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
              >
                <option value={7}>7 Days Sprint</option>
                <option value={14}>14 Days Track</option>
                <option value={30}>30 Days Comprehensive</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Hours Study / Day</label>
              <select
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
              >
                <option value={1}>1 Hour / day</option>
                <option value={2}>2 Hours / day</option>
                <option value={4}>4 Hours / day</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!courseTitle.trim() || loading}
            className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-40"
          >
            {loading ? 'Synthesizing task timelines...' : 'Generate Study Planner'}
          </button>
        </div>

      </div>

      {/* Results timeline */}
      <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 min-h-[300px] flex flex-col justify-between shadow-soft">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <RefreshCw className="h-8 w-8 text-zinc-900 dark:text-white animate-spin" />
            <p className="mt-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">Compiling weekly milestones and calendar targets...</p>
          </div>
        ) : plan.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <CalendarDays className="h-10 w-10 text-zinc-400" />
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Your personalized weekly study calendar will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-rose-200/60 dark:border-zinc-800 pb-3">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Weekly Milestones: {courseTitle}</span>
              <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase">{days} Days sprint • {hours} hrs/day</span>
            </div>

            <div className="space-y-4">
              {plan.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l border-rose-200 dark:border-zinc-800 space-y-2">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-zinc-900 dark:bg-white border-2 border-[#FDF4F8] dark:border-zinc-950 shadow-sm" />
                  
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{item.week}</h4>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">{item.title}</p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 pt-1">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <CheckSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-zinc-400" />
                        <span className="leading-normal">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

