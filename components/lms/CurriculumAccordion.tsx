'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2, PlayCircle, FileText, HelpCircle, ClipboardList, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { Module, LessonType } from '../../lib/lms/types';
import { formatDuration } from '../../lib/lms/utils';

type CurriculumAccordionProps = {
  curriculum: Module[];
  completedLessons?: string[];
  currentLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
  interactive?: boolean;
};

const lessonIcons: Record<LessonType, React.ElementType> = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

export default function CurriculumAccordion({
  curriculum,
  completedLessons = [],
  currentLessonId,
  onLessonClick,
  interactive = false,
}: CurriculumAccordionProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    // Auto-open the module containing the current lesson
    if (currentLessonId) {
      const mod = curriculum.find((m) => m.lessons.some((l) => l.id === currentLessonId));
      if (mod) return new Set([mod.id]);
    }
    return new Set([curriculum[0]?.id ?? '']);
  });

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {curriculum.map((mod, modIdx) => {
        const isOpen = openModules.has(mod.id);
        const completedCount = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
        const totalLessons = mod.lessons.length;
        const totalDuration = mod.lessons.reduce((sum, l) => sum + l.duration, 0);

        return (
          <div
            key={mod.id}
            className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60"
          >
            {/* Module header */}
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-800/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Module {modIdx + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-white truncate">{mod.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {completedCount}/{totalLessons} lessons • {formatDuration(totalDuration)}
                </p>
              </div>
              <ChevronDown
                className={clsx(
                  'h-5 w-5 text-slate-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Lesson list */}
            {isOpen && (
              <div className="border-t border-slate-800/50 px-3 py-2">
                {mod.lessons.map((lesson) => {
                  const Icon = lessonIcons[lesson.type];
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      disabled={!interactive && !onLessonClick}
                      onClick={() => onLessonClick?.(lesson.id)}
                      className={clsx(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition',
                        isCurrent
                          ? 'bg-violet-500/10 border border-violet-500/30 text-violet-200'
                          : 'hover:bg-slate-800/40 text-slate-300',
                        interactive || onLessonClick ? 'cursor-pointer' : 'cursor-default'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <Icon className={clsx('h-4.5 w-4.5 flex-shrink-0', isCurrent ? 'text-violet-400' : 'text-slate-500')} />
                      )}
                      <span className={clsx('flex-1 truncate', isCompleted && 'text-slate-400')}>
                        {lesson.title}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}m
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
