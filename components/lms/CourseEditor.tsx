'use client';

import { useState } from 'react';
import { BookOpen, FileText, Settings, Sparkles, Check, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';
import CurriculumEditor from './CurriculumEditor';
import type { Course, Module } from '../../lib/lms/types';
import { categories } from '../../lib/lms/data/categories';
import Link from 'next/link';

type CourseEditorProps = {
  initialCourse?: Course;
  onSave: (courseData: Partial<Course>) => Promise<any>;
  onDelete?: () => Promise<void>;
  titleText: string;
  isNew?: boolean;
};

type TabType = 'details' | 'curriculum' | 'publish';

const gradientOptions = [
  { value: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', label: 'Indigo Purple' },
  { value: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)', label: 'Rose Pink' },
  { value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)', label: 'Cyan Blue' },
  { value: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)', label: 'Amber Orange' },
  { value: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)', label: 'Emerald Teal' },
];

export default function CourseEditor({
  initialCourse,
  onSave,
  onDelete,
  titleText,
  isNew = false,
}: CourseEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState(initialCourse?.title ?? '');
  const [description, setDescription] = useState(initialCourse?.description ?? '');
  const [longDescription, setLongDescription] = useState(initialCourse?.longDescription ?? '');
  const [category, setCategory] = useState(initialCourse?.category ?? 'Programming');
  const [level, setLevel] = useState(initialCourse?.level ?? 'beginner');
  const [price, setPrice] = useState(initialCourse?.price ?? 0);
  const [thumbnail, setThumbnail] = useState(initialCourse?.thumbnail ?? gradientOptions[0].value);
  const [tagsInput, setTagsInput] = useState(initialCourse?.tags?.join(', ') ?? '');
  
  // Lists
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(initialCourse?.whatYoullLearn ?? []);
  const [learnInput, setLearnInput] = useState('');
  
  const [requirements, setRequirements] = useState<string[]>(initialCourse?.requirements ?? []);
  const [reqInput, setReqInput] = useState('');

  // Curriculum State
  const [curriculum, setCurriculum] = useState<Module[]>(initialCourse?.curriculum ?? []);

  // Handlers
  const addLearnItem = () => {
    if (learnInput.trim() && !whatYoullLearn.includes(learnInput.trim())) {
      setWhatYoullLearn([...whatYoullLearn, learnInput.trim()]);
      setLearnInput('');
    }
  };

  const removeLearnItem = (idx: number) => {
    setWhatYoullLearn(whatYoullLearn.filter((_, i) => i !== idx));
  };

  const addReqItem = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const removeReqItem = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const courseData: Partial<Course> = {
      title,
      description,
      longDescription,
      category,
      level,
      price: Number(price) || 0,
      thumbnail,
      tags,
      whatYoullLearn,
      requirements,
      curriculum,
    };

    try {
      await onSave(courseData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/85 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/teacher/courses"
            className="rounded-xl border border-slate-800 bg-slate-900/85 p-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Instructor Studio</p>
            <h1 className="text-xl font-bold text-white">{titleText}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && initialCourse && (
            <Link
              href={`/courses/${initialCourse.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview Live
            </Link>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-400 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : success ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'details' ? 'border-b-2 border-violet-500 text-violet-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          General Info
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'curriculum' ? 'border-b-2 border-violet-500 text-violet-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Curriculum Builder
        </button>
        {!isNew && (
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === 'publish' ? 'border-b-2 border-violet-500 text-violet-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="h-4 w-4" />
            Publishing
          </button>
        )}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'details' && (
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6 rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Masterclass: Advanced Web Architectures"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Short Subheading / Description</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the main benefit of the course in a single short sentence."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About / Overview (Long Description)</label>
                  <textarea
                    required
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Provide a detailed outline of what this course covers, target audience, and how it is structured."
                    rows={6}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 resize-none"
                  />
                </div>
              </div>

              {/* What You'll Learn & Requirements */}
              <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-900">
                {/* What youll learn */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">What Students Will Learn</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={learnInput}
                      onChange={(e) => setLearnInput(e.target.value)}
                      placeholder="Add learning objective..."
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={addLearnItem}
                      className="rounded-xl bg-slate-850 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 border border-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {whatYoullLearn.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/40 p-2 text-xs text-slate-300">
                        <span className="truncate">{item}</span>
                        <button type="button" onClick={() => removeLearnItem(idx)} className="text-slate-600 hover:text-rose-400">×</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Prerequisites / Requirements</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reqInput}
                      onChange={(e) => setReqInput(e.target.value)}
                      placeholder="Add prerequisite..."
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={addReqItem}
                      className="rounded-xl bg-slate-850 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 border border-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {requirements.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/40 p-2 text-xs text-slate-300">
                        <span className="truncate">{item}</span>
                        <button type="button" onClick={() => removeReqItem(idx)} className="text-slate-600 hover:text-rose-400">×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Course Settings Metadata Sidebar */}
            <div className="space-y-6 rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft self-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-900 pb-2">Classification & Cost</span>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Price (INR)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  placeholder="0 for Free"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500"
                />
                <span className="mt-1 block text-[10px] text-slate-500">Set price to 0 to make this class free for all.</span>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords / Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. react, hooks, visual design"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500"
                />
                <span className="mt-1 block text-[10px] text-slate-500">Separate tags with commas.</span>
              </div>

              {/* Thumbnail Styling */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Cover Color / Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {gradientOptions.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setThumbnail(g.value)}
                      title={g.label}
                      style={{ background: g.value }}
                      className={`h-8 w-full rounded-lg transition-transform ${
                        thumbnail === g.value ? 'scale-110 ring-2 ring-violet-500' : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'curriculum' && (
          <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft">
            <CurriculumEditor curriculum={curriculum} onChange={setCurriculum} />
          </div>
        )}

        {activeTab === 'publish' && !isNew && (
          <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-soft space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white mb-1.5">Publication Settings</h3>
              <p className="text-xs text-slate-400">Controls who can search, enroll in, or view this course.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Course Status: {initialCourse?.status === 'published' ? 'Published' : 'Draft'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {initialCourse?.status === 'published' 
                    ? 'This course is visible to all students in the catalog and open for enrollment.' 
                    : 'This course is only visible to you. Students cannot access it.'}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setSaving(true);
                  if (initialCourse) {
                    await onSave({ status: initialCourse.status === 'published' ? 'draft' : 'published' });
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 2000);
                  }
                  setSaving(false);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  initialCourse?.status === 'published' 
                    ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                {initialCourse?.status === 'published' ? 'Switch to Draft' : 'Publish Course'}
              </button>
            </div>

            <div className="pt-6 border-t border-slate-900 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5" />
                  Danger Zone
                </p>
                <p className="text-xs text-slate-500 mt-1">Permanently delete this course and all associated lectures. This action is irreversible.</p>
              </div>
              {onDelete && (
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Are you absolutely sure you want to delete this course? This will remove all modules, lessons, and student access permanently.')) {
                      setSaving(true);
                      await onDelete();
                      setSaving(false);
                    }
                  }}
                  className="rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-2 text-xs font-semibold hover:bg-rose-500/25 transition"
                >
                  Delete Course
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
