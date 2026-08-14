'use client';

import { useState, useRef } from 'react';
import { FileText, Sparkles, RefreshCw, Layers, Download } from 'lucide-react';
import { generateNotesAndSummary } from '../../lib/ai/client';
import PdfDragDropUpload from './PdfDragDropUpload';

type Flashcard = {
  front: string;
  back: string;
};

export default function AiSummaryGenerator() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'summary' | 'detailed'>('summary');
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Results
  const [summary, setSummary] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setFlippedCards(new Set());

    try {
      const data = await generateNotesAndSummary(text, mode);
      setSummary(data.summary);
      setTakeaways(data.takeaways);
      setFlashcards(data.flashcards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (idx: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleExportPDF = () => {
    if (typeof window === 'undefined') return;
    
    // In a real application, you'd use jspdf or html2pdf, but here we can trigger print prompt
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>ShikshaSetu Detailed Notes</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 0.5rem; }
            h2 { color: #333; margin-top: 2rem; }
            ul { margin-bottom: 2rem; }
            li { margin-bottom: 0.5rem; }
            .flashcard { border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; page-break-inside: avoid; }
            .front { font-weight: bold; margin-bottom: 0.5rem; }
          </style>
        </head>
        <body>
          <h1>ShikshaSetu ${mode === 'detailed' ? 'Detailed Notes' : 'Summary'}</h1>
          <h2>Overview</h2>
          <p>${summary}</p>
          
          <h2>Key Takeaways / Detailed Points</h2>
          <ul>
            ${takeaways.map(t => `<li>${t}</li>`).join('')}
          </ul>
          
          ${flashcards.length > 0 ? `
            <h2>Flashcards & Key Terms</h2>
            ${flashcards.map(c => `
              <div class="flashcard">
                <div class="front">Q: ${c.front}</div>
                <div>A: ${c.back}</div>
              </div>
            `).join('')}
          ` : ''}
          
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Input panel */}
      <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 space-y-4 self-start shadow-soft">
        <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-zinc-800 pb-3">
          <Layers className="h-4 w-4 text-zinc-900 dark:text-white" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Syllabus summarizer</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Paste reading materials below or drop a PDF file to extract notes, then generate structured takeaways and interactive study flashcards.
        </p>

        <PdfDragDropUpload 
          onTextExtracted={(extracted) => setText(extracted)} 
          className="mb-2"
        />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input 
                type="radio" 
                name="mode" 
                value="summary" 
                checked={mode === 'summary'} 
                onChange={(e) => setMode(e.target.value as 'summary' | 'detailed')}
                className="text-rose-600 focus:ring-rose-500"
              />
              Brief Summary
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input 
                type="radio" 
                name="mode" 
                value="detailed" 
                checked={mode === 'detailed'} 
                onChange={(e) => setMode(e.target.value as 'summary' | 'detailed')}
                className="text-rose-600 focus:ring-rose-500"
              />
              Detailed Notes (for books)
            </label>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste syllabus text or notes here (minimum 20 characters)..."
            rows={8}
            className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none leading-relaxed"
          />

          <button
            type="button"
            onClick={handleSummarize}
            disabled={text.length < 20 || loading}
            className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-40"
          >
            {loading ? 'Synthesizing summaries...' : 'Summarize Text'}
          </button>
        </div>

      </div>

      {/* Results panel */}
      <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 min-h-[300px] flex flex-col justify-between shadow-soft">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <RefreshCw className="h-8 w-8 text-zinc-900 dark:text-white animate-spin" />
            <p className="mt-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">Distilling insights and drafting terms...</p>
          </div>
        ) : !summary ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <FileText className="h-10 w-10 text-zinc-400" />
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Summaries, bullet takeaways, and flashcards will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5" ref={resultsRef}>
            <div className="flex justify-between items-center mb-4 border-b border-rose-200/80 dark:border-zinc-800 pb-2">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">
                {mode === 'detailed' ? 'Detailed Chapter Notes' : 'Executive Summary'}
              </span>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors"
                aria-label="Export as PDF"
              >
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-rose-200/80 dark:border-zinc-800 shadow-sm">
                {summary}
              </p>
            </div>

            {/* Bullet takeaways */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">Key Takeaways</span>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-900 dark:bg-white" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Flashcards */}
            {flashcards.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-rose-200/80 dark:border-zinc-800">
                <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">Interactive Study Flashcards</span>
                <p className="text-[10px] text-zinc-500 pb-1">Click any card to reveal definitions.</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {flashcards.map((card, idx) => {
                    const isFlipped = flippedCards.has(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleFlip(idx)}
                        className="h-28 w-full perspective cursor-pointer text-left"
                      >
                        <div className={`relative w-full h-full duration-500 transform-style ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}>
                          {/* Front */}
                          <div className="absolute inset-0 backface-hidden rounded-2xl border border-rose-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between shadow-sm">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Term</span>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white text-center mt-2 truncate">{card.front}</p>
                            <span className="text-[9px] font-mono text-zinc-900 dark:text-white text-right mt-2 font-semibold">Flip →</span>
                          </div>

                          {/* Back */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-rose-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between shadow-sm">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Definition</span>
                            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed text-center overflow-y-auto mt-1 max-h-16">
                              {card.back}
                            </p>
                            <span className="text-[9px] font-mono text-zinc-500 text-right mt-1 font-semibold">Flip →</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

