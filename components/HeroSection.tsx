'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, ArrowUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '../lib/language/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-20 sm:px-10 lg:px-16 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="absolute inset-x-0 top-0 h-96 bg-hero-gradient opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Left Column: Headline, Subtitle, Actions, Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3.5 py-1.5 text-xs font-mono font-medium tracking-[0.18em] uppercase text-zinc-800 dark:text-zinc-200">
              <span className="text-zinc-500">✦</span>
              <span>{t('hero_badge')}</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-6xl leading-[1.1]">
                {t('hero_title')}
              </h1>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t('hero_subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-6 py-3 text-xs font-medium uppercase tracking-wider !text-white dark:!text-[#171717] transition-colors shadow-none"
              >
                <span>{t('hero_cta_start')}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3 text-xs font-medium uppercase tracking-wider text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
              >
                {t('hero_cta_explore')}
              </a>
            </div>

            {/* Highlights Row */}
            <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-sm font-semibold font-mono tracking-wider text-zinc-900 dark:text-white uppercase">{t('hero_stat_powered')}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{t('hero_stat_tools')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold font-mono tracking-wider text-zinc-900 dark:text-white uppercase">{t('hero_stat_adaptive')}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{t('hero_stat_engine')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold font-mono tracking-wider text-zinc-900 dark:text-white uppercase">{t('hero_stat_support')}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{t('hero_stat_ai_support')}</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Visual Reference Mockup Card (SynthAI Chat Showcase) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-none backdrop-blur-xl">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] text-white dark:bg-white dark:text-zinc-900">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-white uppercase">ShikshaSetu AI Tutor</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#2F7D5A] dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
                  <CheckCircle className="h-3 w-3" /> ACTIVE
                </span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="py-6 space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70 px-4 py-3 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    Hi, I need a summary of my study progress and custom quiz targets for this week.
                  </div>
                </div>

                <div className="flex justify-start gap-3 items-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#171717] text-white dark:bg-white dark:text-zinc-900 text-xs mt-1">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Sure! Your course completion increased by 14% this week. I generated 3 practice quizzes and customized flashcards for your upcoming exam.
                  </div>
                </div>
              </div>

              {/* Bottom Input Bar */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 pl-1">Ask AI study assistant...</span>
                <button
                  type="button"
                  aria-label="Send query"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] hover:bg-[#262626] text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-[#171717] transition-colors"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>

  );
}

