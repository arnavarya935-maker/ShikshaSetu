'use client';

import { useMemo } from 'react';
import clsx from 'clsx';

type MiniCalendarProps = {
  highlightedDays?: number[]; // e.g. [8, 15]
  monthLabel?: string;
  daysOffset?: number; // number of empty slots before first day
  todayDay?: number;
  className?: string;
};

export default function MiniCalendar({ 
  highlightedDays = [8, 15], 
  monthLabel, 
  daysOffset, 
  todayDay, 
  className 
}: MiniCalendarProps) {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const todayDate = useMemo(() => new Date(), []);
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();

  const resolvedToday = todayDay !== undefined ? todayDay : todayDate.getDate();

  const resolvedMonthLabel = useMemo(() => {
    if (monthLabel) return monthLabel;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[currentMonth]} ${currentYear}`;
  }, [monthLabel, currentMonth, currentYear]);

  const resolvedDaysOffset = useMemo(() => {
    if (daysOffset !== undefined) return daysOffset;
    // Get the first day of the current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const dayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    // M, T, W, T, F, S, S means Monday is index 0, Sunday is index 6
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }, [daysOffset, currentYear, currentMonth]);

  const totalDays = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Construct empty padding slots + day slots
  const days = useMemo(() => {
    const list = [];
    // Padding
    for (let i = 0; i < resolvedDaysOffset; i++) {
      list.push({ day: null });
    }
    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      list.push({ day: d });
    }
    return list;
  }, [resolvedDaysOffset, totalDays]);

  return (
    <div className={clsx("w-full rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-white">{resolvedMonthLabel}</span>
        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">3 Events</span>
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
        {daysOfWeek.map((d, idx) => (
          <span key={idx}>{d}</span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center text-xs">
        {days.map((item, idx) => {
          if (item.day === null) {
            return <span key={idx} />;
          }

          const isHighlighted = highlightedDays.includes(item.day);
          const isToday = item.day === resolvedToday;

          return (
            <span
              key={idx}
              className={clsx(
                "h-7 w-7 flex items-center justify-center rounded-full text-xs mx-auto transition-all cursor-pointer",
                isToday
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold shadow-sm"
                  : isHighlighted
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              {item.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
