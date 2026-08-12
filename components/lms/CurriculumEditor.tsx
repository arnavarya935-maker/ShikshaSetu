'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Play, FileText, CheckCircle, Award, ChevronDown, ChevronUp, Link as LinkIcon, AlertCircle } from 'lucide-react';
import type { Module, Lesson, LessonType, Quiz, Assignment, Resource } from '../../lib/lms/types';

type CurriculumEditorProps = {
  curriculum: Module[];
  onChange: (curriculum: Module[]) => void;
};

export default function CurriculumEditor({ curriculum, onChange }: CurriculumEditorProps) {
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(0);

  const addModule = () => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${curriculum.length + 1}: New Module`,
      lessons: [],
    };
    onChange([...curriculum, newModule]);
    setActiveModuleIdx(curriculum.length);
  };

  const updateModuleTitle = (idx: number, title: string) => {
    const list = [...curriculum];
    list[idx] = { ...list[idx], title };
    onChange(list);
  };

  const deleteModule = (idx: number) => {
    const list = curriculum.filter((_, i) => i !== idx);
    onChange(list);
    setActiveModuleIdx(list.length > 0 ? 0 : null);
  };

  const addLesson = (moduleIdx: number, type: LessonType) => {
    const module = curriculum[moduleIdx];
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `New ${type.toUpperCase()} Lesson`,
      type,
      duration: type === 'video' ? 15 : type === 'quiz' ? 10 : 30,
      resources: [],
      ...(type === 'video' ? { videoUrl: '' } : {}),
      ...(type === 'text' ? { content: '' } : {}),
      ...(type === 'quiz' ? {
        quiz: {
          id: `quiz-${Date.now()}`,
          title: 'Lesson Quiz',
          description: 'Quick check-in quiz',
          questions: [],
          passingScore: 70,
          timeLimitMinutes: 10,
        },
      } : {}),
      ...(type === 'assignment' ? {
        assignment: {
          id: `asgn-${Date.now()}`,
          title: 'Lesson Assignment',
          description: '',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          maxScore: 100,
          submissions: [],
        },
      } : {}),
    };

    const list = [...curriculum];
    list[moduleIdx] = {
      ...module,
      lessons: [...module.lessons, newLesson],
    };
    onChange(list);
  };

  const updateLesson = (moduleIdx: number, lessonIdx: number, updated: Lesson) => {
    const list = [...curriculum];
    const lessons = [...list[moduleIdx].lessons];
    lessons[lessonIdx] = updated;
    list[moduleIdx] = { ...list[moduleIdx], lessons };
    onChange(list);
  };

  const deleteLesson = (moduleIdx: number, lessonIdx: number) => {
    const list = [...curriculum];
    const lessons = list[moduleIdx].lessons.filter((_, i) => i !== lessonIdx);
    list[moduleIdx] = { ...list[moduleIdx], lessons };
    onChange(list);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Course Curriculum</h3>
        <button
          type="button"
          onClick={addModule}
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Module
        </button>
      </div>

      {curriculum.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-800/80 bg-slate-950/70 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-slate-500" />
          <p className="mt-3 text-sm text-slate-400">No modules created yet. Add your first module to begin building the curriculum.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {curriculum.map((mod, modIdx) => {
            const isActive = activeModuleIdx === modIdx;
            return (
              <div
                key={mod.id}
                className={`rounded-2xl border ${
                  isActive ? 'border-violet-500/30 bg-slate-900/40 shadow-soft' : 'border-slate-800/60 bg-slate-950/40'
                } transition-colors duration-200`}
              >
                {/* Module Header */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex flex-1 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModuleIdx(isActive ? null : modIdx)}
                      className="rounded-lg p-1 text-slate-500 hover:text-white hover:bg-slate-800"
                    >
                      {isActive ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                    </button>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
                      className="flex-1 border-b border-transparent bg-transparent py-1 font-semibold text-white outline-none focus:border-slate-700 focus:bg-slate-900/50 px-2 rounded"
                      placeholder="Module Title"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteModule(modIdx)}
                      title="Delete Module"
                      className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Module Lessons list */}
                {isActive && (
                  <div className="border-t border-slate-800/40 px-5 py-4 space-y-4">
                    {mod.lessons.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-3">No lessons in this module.</p>
                    ) : (
                      <div className="space-y-4">
                        {mod.lessons.map((lesson, lesIdx) => (
                          <LessonItemEditor
                            key={lesson.id}
                            lesson={lesson}
                            onChange={(updated) => updateLesson(modIdx, lesIdx, updated)}
                            onDelete={() => deleteLesson(modIdx, lesIdx)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Add Lesson Actions */}
                    <div className="pt-2 border-t border-slate-800/40">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">Add New Lesson</p>
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                        {(['video', 'text', 'quiz', 'assignment'] as LessonType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => addLesson(modIdx, type)}
                            className="inline-flex items-center gap-1.5 justify-center rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                            {type.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── LessonItemEditor ─────────────────────────────────────── */

type LessonItemEditorProps = {
  lesson: Lesson;
  onChange: (lesson: Lesson) => void;
  onDelete: () => void;
};

function LessonItemEditor({ lesson, onChange, onDelete }: LessonItemEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const updateField = (key: keyof Lesson, value: any) => {
    onChange({ ...lesson, [key]: value });
  };

  const addResource = () => {
    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title: 'New PDF Resource',
      url: '',
      type: 'pdf',
    };
    updateField('resources', [...(lesson.resources ?? []), newRes]);
  };

  const updateResource = (idx: number, updated: Resource) => {
    const list = [...(lesson.resources ?? [])];
    list[idx] = updated;
    updateField('resources', list);
  };

  const deleteResource = (idx: number) => {
    const list = (lesson.resources ?? []).filter((_, i) => i !== idx);
    updateField('resources', list);
  };

  // Type color helpers
  const badges: Record<LessonType, { text: string; bg: string; icon: any }> = {
    video: { text: 'Video', bg: 'text-violet-400 border-violet-500/20 bg-violet-500/10', icon: Play },
    text: { text: 'Text', bg: 'text-blue-400 border-blue-500/20 bg-blue-500/10', icon: FileText },
    quiz: { text: 'Quiz', bg: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10', icon: CheckCircle },
    assignment: { text: 'Task', bg: 'text-amber-400 border-amber-500/20 bg-amber-500/10', icon: Award },
  };

  const BadgeIcon = badges[lesson.type].icon;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-900/30">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded p-1 text-slate-500 hover:text-white"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badges[lesson.type].bg}`}>
            <BadgeIcon className="h-3 w-3" />
            {badges[lesson.type].text}
          </span>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-slate-800 px-1 py-0.5 rounded truncate"
            placeholder="Lesson Title"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={lesson.duration}
            onChange={(e) => updateField('duration', parseInt(e.target.value) || 0)}
            className="w-12 bg-slate-900 text-center text-xs text-slate-300 py-1 rounded outline-none border border-slate-800"
            title="Duration in minutes"
          />
          <span className="text-[10px] text-slate-500">min</span>
          <button
            type="button"
            onClick={onDelete}
            title="Delete Lesson"
            className="rounded p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900/60"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 border-t border-slate-900 bg-slate-950/20 text-sm">
          {/* Video Lesson Type fields */}
          {lesson.type === 'video' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Video URL</label>
              <input
                type="text"
                value={lesson.videoUrl ?? ''}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                placeholder="YouTube embed url (e.g. https://www.youtube.com/embed/...) or MP4 URL"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>
          )}

          {/* Text / Markdown Content */}
          {(lesson.type === 'text' || lesson.type === 'video') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {lesson.type === 'video' ? 'Description / Notes' : 'Content (Markdown Supported)'}
              </label>
              <textarea
                value={lesson.content ?? ''}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Write lesson notes, markdown details, or summary here..."
                rows={5}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 resize-none font-mono"
              />
            </div>
          )}

          {/* Quiz Editor */}
          {lesson.type === 'quiz' && lesson.quiz && (
            <QuizEditorSubform
              quiz={lesson.quiz}
              onChange={(updatedQuiz) => updateField('quiz', updatedQuiz)}
            />
          )}

          {/* Assignment Editor */}
          {lesson.type === 'assignment' && lesson.assignment && (
            <AssignmentEditorSubform
              assignment={lesson.assignment}
              onChange={(updatedAsgn) => updateField('assignment', updatedAsgn)}
            />
          )}

          {/* Resources Editor */}
          <div className="pt-3 border-t border-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lesson Resources / Downloads</span>
              <button
                type="button"
                onClick={addResource}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-400 hover:text-violet-300"
              >
                <Plus className="h-3 w-3" />
                Add Resource
              </button>
            </div>
            
            {(!lesson.resources || lesson.resources.length === 0) ? (
              <p className="text-[10px] text-slate-600">No resources added. Perfect for checklists, sheets, or homework files.</p>
            ) : (
              <div className="space-y-2">
                {lesson.resources.map((res, resIdx) => (
                  <div key={res.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-900 bg-slate-950/60 p-2">
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => updateResource(resIdx, { ...res, title: e.target.value })}
                      placeholder="Resource Title"
                      className="flex-1 bg-slate-900 px-2 py-1 rounded text-xs text-white outline-none border border-slate-800 focus:border-slate-700"
                    />
                    <input
                      type="text"
                      value={res.url}
                      onChange={(e) => updateResource(resIdx, { ...res, url: e.target.value })}
                      placeholder="Download Link / URL"
                      className="flex-[2] bg-slate-900 px-2 py-1 rounded text-xs text-white outline-none border border-slate-800 focus:border-slate-700"
                    />
                    <select
                      value={res.type}
                      onChange={(e) => updateResource(resIdx, { ...res, type: e.target.value as any })}
                      className="bg-slate-900 text-xs px-2 py-1 rounded text-white border border-slate-800"
                    >
                      <option value="pdf">PDF</option>
                      <option value="link">Link</option>
                      <option value="doc">Doc</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteResource(resIdx)}
                      className="text-slate-600 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── QuizEditorSubform ────────────────────────────────────── */

function QuizEditorSubform({ quiz, onChange }: { quiz: Quiz; onChange: (quiz: Quiz) => void }) {
  const updateField = (key: keyof Quiz, value: any) => {
    onChange({ ...quiz, [key]: value });
  };

  const addQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      question: 'New MCQ Question?',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correctOptionId: 'a',
      explanation: 'Explanation for correct choice.',
    };
    updateField('questions', [...(quiz.questions ?? []), newQ]);
  };

  const updateQuestion = (idx: number, q: any) => {
    const list = [...(quiz.questions ?? [])];
    list[idx] = q;
    updateField('questions', list);
  };

  const deleteQuestion = (idx: number) => {
    const list = (quiz.questions ?? []).filter((_, i) => i !== idx);
    updateField('questions', list);
  };

  return (
    <div className="space-y-3 bg-slate-900/20 p-3 rounded-xl border border-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Questions</span>
        <button
          type="button"
          onClick={addQuestion}
          className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
        >
          + Add Question
        </button>
      </div>

      {(!quiz.questions || quiz.questions.length === 0) ? (
        <p className="text-[10px] text-slate-600 text-center py-2">Add MCQ questions. Questions have description, options, and explanation.</p>
      ) : (
        <div className="space-y-4">
          {quiz.questions.map((q, qIdx) => (
            <div key={q.id} className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-900">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Q{qIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteQuestion(qIdx)}
                  className="text-slate-600 hover:text-rose-400 p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, { ...q, question: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                placeholder="Question text"
              />

              {/* Options mapping */}
              <div className="grid gap-2 grid-cols-2">
                {q.options.map((opt: any, oIdx: number) => (
                  <div key={opt.id} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctOptionId === opt.id}
                      onChange={() => updateQuestion(qIdx, { ...q, correctOptionId: opt.id })}
                      title="Mark as correct"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...q.options];
                        newOpts[oIdx] = { ...opt, text: e.target.value };
                        updateQuestion(qIdx, { ...q, options: newOpts });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white flex-1"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <input
                type="text"
                value={q.explanation}
                onChange={(e) => updateQuestion(qIdx, { ...q, explanation: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300"
                placeholder="Explanation of correct option"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AssignmentEditorSubform ─────────────────────────────── */

function AssignmentEditorSubform({
  assignment,
  onChange,
}: {
  assignment: Assignment;
  onChange: (asgn: Assignment) => void;
}) {
  const updateField = (key: keyof Assignment, value: any) => {
    onChange({ ...assignment, [key]: value });
  };

  return (
    <div className="space-y-3 bg-slate-900/20 p-3 rounded-xl border border-slate-900">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assignment Specifications</span>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Max Score</label>
          <input
            type="number"
            value={assignment.maxScore}
            onChange={(e) => updateField('maxScore', parseInt(e.target.value) || 100)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
          <input
            type="datetime-local"
            value={assignment.dueDate ? assignment.dueDate.slice(0, 16) : ''}
            onChange={(e) => updateField('dueDate', new Date(e.target.value).toISOString())}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Description / Prompts</label>
        <textarea
          value={assignment.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Detail the task checklist, files, or submission steps..."
          rows={3}
          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white placeholder-slate-600 resize-none"
        />
      </div>
    </div>
  );
}
