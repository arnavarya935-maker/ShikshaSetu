'use client';

import { useState } from 'react';
import { HelpCircle, Sparkles, BookOpen, FileText } from 'lucide-react';
import { generateAiQuiz } from '../../lib/ai/client';
import QuizPlayer from './QuizPlayer';
import PdfDragDropUpload from './PdfDragDropUpload';
import type { Quiz } from '../../lib/lms/types';
import { useLanguage } from '../../lib/language/LanguageContext';

export default function AiQuizGenerator() {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'topic' | 'pdf'>('topic');
  const [extractedText, setExtractedText] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleGenerate = async () => {
    const isPdfMode = mode === 'pdf';
    const inputTopic = isPdfMode ? pdfFilename : topic;
    const inputText = isPdfMode ? extractedText : undefined;

    if (isPdfMode && !extractedText) {
      alert('Please upload a PDF first to extract its contents.');
      return;
    }
    if (!isPdfMode && !topic.trim()) return;

    setLoading(true);
    setQuiz(null);

    try {
      const questions = await generateAiQuiz(inputTopic, inputText);
      if (questions && questions.length > 0) {
        const generatedQuiz: Quiz = {
          id: `ai-quiz-${Date.now()}`,
          title: isPdfMode ? `Quiz: ${pdfFilename}` : `AI generated quiz: ${topic}`,
          description: isPdfMode 
            ? `Practice quiz generated from your uploaded document: ${pdfFilename}`
            : `Custom practice quiz generated dynamically for subject: ${topic}`,
          questions,
          passingScore: 70,
          timeLimitMinutes: 10,
        };
        setQuiz(generatedQuiz);
      } else {
        alert('Could not generate quiz. Please try another subject or document.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during quiz generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtracted = (text: string, filename: string) => {
    setExtractedText(text);
    setPdfFilename(filename);
  };

  return (
    <div className="space-y-6">
      {/* Generate parameters form */}
      {!quiz && (
        <div className="max-w-xl mx-auto rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-6 sm:p-8 space-y-5 shadow-soft">
          <div className="flex items-center justify-between border-b border-rose-200/60 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-zinc-900 dark:text-white" />
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Dynamic Quiz Builder</span>
            </div>
            
            {/* Mode Toggle Button Tabs */}
            <div className="flex rounded-lg bg-white dark:bg-zinc-900 p-1 border border-[#DCDCDC] dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setMode('topic')}
                className={`rounded-md px-3 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  mode === 'topic' ? 'bg-[#171717] !text-white dark:bg-white dark:!text-[#171717]' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Topic
              </button>
              <button
                type="button"
                onClick={() => setMode('pdf')}
                className={`rounded-md px-3 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  mode === 'pdf' ? 'bg-[#171717] !text-white dark:bg-white dark:!text-[#171717]' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                PDF File
              </button>
            </div>
          </div>

          {mode === 'topic' ? (
            <>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Enter any subject topic (e.g. &quot;CSS grids&quot;, &quot;Linear algebra&quot;) and the AI will generate 3 customized multiple-choice questions for you to practice.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React hooks, Auto Layout, Python analytics..."
                  className="w-full rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!topic.trim() || loading}
                  className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-40"
                >
                  {loading ? 'Generating practice questions...' : 'Generate custom Quiz'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Upload or drag & drop any PDF document, and our AI will build custom quiz questions directly from its text context!
              </p>

              <div className="space-y-4">
                <PdfDragDropUpload onTextExtracted={handleTextExtracted} />

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!extractedText || loading}
                  className="w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-40"
                >
                  {loading ? 'Analyzing document & building questions...' : 'Generate Quiz from PDF'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Embed Quiz Player when generated */}
      {quiz && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Dynamic Quiz Playroom</h3>
            <button
              type="button"
              onClick={() => {
                setQuiz(null);
                setExtractedText('');
                setPdfFilename('');
              }}
              className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
            >
              Build another Quiz
            </button>
          </div>
          <QuizPlayer quiz={quiz} />
        </div>
      )}

    </div>
  );
}

