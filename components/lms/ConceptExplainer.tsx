'use client';

import { useState } from 'react';
import { Lightbulb, Send, BrainCircuit, ShieldAlert, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { explainConcept } from '../../lib/ai/client';

const DIFFICULTY_LEVELS = [
  { id: 'ELI5', label: 'Explain Like I\'m 5', desc: 'Simple analogies' },
  { id: 'High School', label: 'High School', desc: 'Standard curriculum' },
  { id: 'College', label: 'College', desc: 'Academic rigor' },
  { id: 'Expert', label: 'Expert', desc: 'Deep technical nuance' },
];

export default function ConceptExplainer() {
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState('ELI5');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setError(null);
    setExplanation('');

    try {
      const response = await explainConcept(concept, level);
      setExplanation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 shadow-soft space-y-6">
      <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-zinc-800 pb-3">
        <BrainCircuit className="h-4 w-4 text-rose-600 dark:text-rose-500" />
        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Concept Explainer</span>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="concept" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">What do you want to learn?</label>
          <div className="relative">
            <input
              id="concept"
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Quantum Entanglement, Supply & Demand, Recursion..."
              className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pl-10 text-sm text-zinc-900 dark:text-white outline-none transition focus:border-rose-500 dark:focus:border-rose-500"
              onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            />
            <Lightbulb className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Select Difficulty Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DIFFICULTY_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevel(lvl.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  level === lvl.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-rose-300 dark:hover:border-rose-700/50'
                }`}
              >
                <span className={`text-xs font-bold ${level === lvl.id ? 'text-rose-700 dark:text-rose-400' : 'text-zinc-900 dark:text-white'}`}>
                  {lvl.label}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExplain}
          disabled={!concept.trim() || loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Sparkles className="h-4 w-4 animate-pulse" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {loading ? 'Synthesizing...' : 'Explain It'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-3 text-left">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-normal">{error}</p>
        </div>
      )}

      {explanation && (
        <div className="mt-6 border-t border-rose-200/60 dark:border-zinc-800 pt-6">
          <div className="prose prose-sm dark:prose-invert prose-rose max-w-none prose-headings:font-bold prose-headings:text-rose-600 dark:prose-headings:text-rose-400 prose-p:leading-relaxed text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-rose-100 dark:border-zinc-800 shadow-sm">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
