'use client';

import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';
import AssignmentForm from './AssignmentForm';
import type { Lesson } from '../../lib/lms/types';

type LessonContentProps = {
  lesson: Lesson;
  onQuizComplete?: (score: number, passed: boolean) => void;
  onAssignmentSubmit?: (content: string) => void;
};

export default function LessonContent({ lesson, onQuizComplete, onAssignmentSubmit }: LessonContentProps) {
  switch (lesson.type) {
    case 'video':
      return (
        <div className="space-y-6">
          <VideoPlayer url={lesson.videoUrl ?? ''} title={lesson.title} />
          {lesson.content && (
            <div className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-6">
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                {lesson.content}
              </div>
            </div>
          )}
        </div>
      );

    case 'text':
      return (
        <div className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">{lesson.title}</h2>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
            {lesson.content ?? 'Content coming soon.'}
          </div>
        </div>
      );

    case 'quiz':
      if (!lesson.quiz) {
        return (
          <div className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-8 text-center">
            <p className="text-slate-400">Quiz not available yet.</p>
          </div>
        );
      }
      return <QuizPlayer quiz={lesson.quiz} onComplete={onQuizComplete} />;

    case 'assignment':
      if (!lesson.assignment) {
        return (
          <div className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-8 text-center">
            <p className="text-slate-400">Assignment not available yet.</p>
          </div>
        );
      }
      return <AssignmentForm assignment={lesson.assignment} onSubmit={onAssignmentSubmit} />;

    default:
      return (
        <div className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-8 text-center">
          <p className="text-slate-400">Unsupported lesson type.</p>
        </div>
      );
  }
}
