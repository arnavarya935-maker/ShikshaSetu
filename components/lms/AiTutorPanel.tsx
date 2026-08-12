'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, GraduationCap } from 'lucide-react';
import { askAiTutor } from '../../lib/ai/client';
import clsx from 'clsx';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const suggestedPrompts = [
  'Explain React useEffect cleanups',
  'What is the 8-point grid layout system?',
  'How do eigenvalues work in recommendation engines?',
  'Explain pandas DataFrame groupby aggregates',
];

export default function AiTutorPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `### Welcome to ShikshaSetu AI Tutor! 🎓

I can explain academic concepts, resolve code/design doubts, and help you study.

Select a query below or type your question:`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(1);
      const reply = await askAiTutor(text, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection issue. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] h-[550px] overflow-hidden">
      {/* Main chat window */}
      <div className="rounded-[2rem] border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 flex flex-col justify-between overflow-hidden shadow-soft">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={clsx(
                  'flex gap-3 max-w-[85%]',
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div
                  className={clsx(
                    'h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold border shadow-sm',
                    isUser
                      ? 'bg-zinc-900 border-zinc-900 !text-white dark:bg-white dark:border-white dark:!text-zinc-900'
                      : 'bg-white border-rose-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100'
                  )}
                >
                  {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                </div>

                <div
                  className={clsx(
                    'rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap shadow-sm',
                    isUser
                      ? 'bg-zinc-900 !text-white dark:bg-white dark:!text-zinc-900'
                      : 'bg-white border border-rose-200/80 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200'
                  )}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-white border border-rose-200 flex items-center justify-center text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-4 bg-white border border-rose-200 text-zinc-500 text-xs flex items-center gap-1.5 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="h-1.5 w-1.5 bg-zinc-900 dark:bg-white rounded-full animate-bounce" />
                <div className="h-1.5 w-1.5 bg-zinc-900 dark:bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 bg-zinc-900 dark:bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-rose-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask a doubt or paste a code block..."
            className="flex-1 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 !text-white dark:!text-[#171717] transition-colors shadow-none disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggested doubt topics sidebar */}
      <div className="rounded-2xl border border-rose-200/80 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-950/60 p-5 space-y-4 self-start shadow-none">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-zinc-900 dark:text-white" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Suggested Queries</span>
        </div>

        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
          Click any of these quick queries to test the tutor explaining topics with code guidelines.
        </p>

        <div className="space-y-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="w-full text-left rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs font-medium text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

