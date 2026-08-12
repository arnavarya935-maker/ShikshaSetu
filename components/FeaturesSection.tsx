'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUp, Sparkles, FileText, CheckCircle2, Flame, Award, BookOpen, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../lib/language/LanguageContext';

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FeaturesSectionProps = {
  features: FeatureItem[];
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fast & responsive scroll height (260vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Snappy 60fps spring physics momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 22,
    restDelta: 0.001,
  });

  // Smooth scroll programmatically to a specific feature index
  const scrollToFeature = (targetIndex: number) => {
    if (!containerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(features.length - 1, targetIndex));
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const containerHeight = containerRef.current.offsetHeight;
    const scrollableDistance = containerHeight - window.innerHeight;
    const targetY = containerTop + (clampedIndex / Math.max(1, features.length - 1)) * scrollableDistance;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} id="features" className="relative h-[260vh] bg-white dark:bg-zinc-950 transition-colors duration-200">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden px-4 sm:px-8 py-6 sm:py-8 lg:px-12">
        
        {/* Sticky Header Section */}
        <div className="mx-auto w-full max-w-4xl text-center shrink-0 space-y-3">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-rose-50/60 dark:bg-zinc-900 px-3.5 py-1 text-xs font-mono font-medium tracking-[0.18em] uppercase text-rose-600 dark:text-rose-400">
            <span>✦</span>
            <span>{t('hero_badge')}</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-5xl">
            {t('feat_heading')}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            {t('feat_subheading')}
          </p>
          
          {/* Top Horizontal Progress Bar */}
          <div className="pt-1 flex items-center justify-center gap-2">
            {features.map((f, i) => (
              <TopPillIndicator
                key={f.title}
                index={i}
                total={features.length}
                smoothProgress={smoothProgress}
                onClick={() => scrollToFeature(i)}
              />
            ))}
          </div>
        </div>

        {/* Center Section Stage with Card & External Controls */}
        <div className="relative mx-auto my-auto w-full max-w-7xl flex items-center justify-center px-4 sm:px-12">
          
          {/* External Left PREV Button */}
          <div className="hidden lg:flex flex-col items-center gap-2 absolute left-0 z-20">
            <button
              type="button"
              onClick={() => scrollToFeature(getActiveIndex(smoothProgress.get(), features.length) - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
              aria-label="Previous feature"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500">PREV</span>
          </div>

          {/* Prominent Large Feature Card Frame */}
          <div className="relative w-full max-w-5xl h-[380px] sm:h-[420px] lg:h-[440px]">
            {features.map((feature, index) => (
              <LargeFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                total={features.length}
                smoothProgress={smoothProgress}
              />
            ))}
          </div>

          {/* External Right NEXT Button */}
          <div className="hidden lg:flex flex-col items-center gap-2 absolute right-8 z-20">
            <button
              type="button"
              onClick={() => scrollToFeature(getActiveIndex(smoothProgress.get(), features.length) + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
              aria-label="Next feature"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500">NEXT</span>
          </div>

          {/* External Far-Right Vertical Number Navigation (01 - 06) */}
          <div className="hidden xl:flex flex-col gap-3 absolute right-0 top-1/2 -translate-y-1/2 z-20">
            {features.map((_, i) => (
              <VerticalStepNumber
                key={i}
                index={i}
                total={features.length}
                smoothProgress={smoothProgress}
                onClick={() => scrollToFeature(i)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar: Scroll Hint & Floating Back-To-Top Button */}
        <div className="relative mx-auto w-full max-w-7xl flex items-center justify-between shrink-0 pt-2">
          <div className="w-10" />
          
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            <span className="inline-block animate-bounce">🖱</span>
            <span>SCROLL TO EXPLORE FEATURES</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171717] hover:bg-[#262626] text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-[#171717] transition-colors shadow-none"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>


      </div>
    </div>
  );
}

function getActiveIndex(progress: number, total: number) {
  const step = 1 / total;
  return Math.min(total - 1, Math.max(0, Math.floor(progress / step)));
}

function TopPillIndicator({
  index,
  total,
  smoothProgress,
  onClick,
}: {
  index: number;
  total: number;
  smoothProgress: any;
  onClick: () => void;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const width = useTransform(
    smoothProgress,
    [start, (start + end) / 2, end],
    ['12px', '32px', '12px']
  );

  const opacity = useTransform(
    smoothProgress,
    [start - step * 0.2, start, end - step * 0.2, end],
    [0.35, 1, 1, 0.35]
  );

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{ width, opacity }}
      className="h-2 rounded-full bg-rose-500 transition-colors duration-200 cursor-pointer"
      aria-label={`Go to feature ${index + 1}`}
    />
  );
}

function VerticalStepNumber({
  index,
  total,
  smoothProgress,
  onClick,
}: {
  index: number;
  total: number;
  smoothProgress: any;
  onClick: () => void;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const color = useTransform(
    smoothProgress,
    [start - step * 0.2, start, end - step * 0.2, end],
    ['#a1a1aa', '#f43f5e', '#f43f5e', '#a1a1aa']
  );

  const isCurrent = useTransform(
    smoothProgress,
    [start - step * 0.2, start, end - step * 0.2, end],
    [0, 1, 1, 0]
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-mono font-bold transition hover:text-rose-500"
    >
      <motion.span style={{ color }}>0{index + 1}</motion.span>
      <motion.span style={{ opacity: isCurrent, color: '#f43f5e' }}>|</motion.span>
    </button>
  );
}

function LargeFeatureCard({
  feature,
  index,
  total,
  smoothProgress,
}: {
  feature: FeatureItem;
  index: number;
  total: number;
  smoothProgress: any;
}) {
  const Icon = feature.icon;
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Ultra-smooth 2D GPU accelerated transforms
  const opacity = useTransform(
    smoothProgress,
    [
      start - step * 0.25,
      start,
      end - step * 0.15,
      index === total - 1 ? 1 : end,
    ],
    [0, 1, 1, index === total - 1 ? 1 : 0]
  );

  const scale = useTransform(
    smoothProgress,
    [
      start - step * 0.25,
      start,
      end - step * 0.15,
      index === total - 1 ? 1 : end,
    ],
    [0.95, 1, 1, index === total - 1 ? 1 : 0.96]
  );

  const y = useTransform(
    smoothProgress,
    [
      start - step * 0.25,
      start,
      end - step * 0.15,
      index === total - 1 ? 1 : end,
    ],
    [40, 0, 0, index === total - 1 ? 0 : -30]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        willChange: 'transform, opacity',
      }}
      className="absolute inset-0 w-full h-full rounded-[3rem] border border-rose-100 dark:border-zinc-800 bg-[#FDF4F8] dark:bg-zinc-900/90 p-6 sm:p-10 lg:p-12 shadow-soft flex flex-col justify-between overflow-hidden"
    >
      {/* Card Content Grid */}
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center h-full">
        
        {/* Left Column: Icon, Badges, Title, Description */}
        <div className="flex flex-col justify-between h-full py-2">
          <div>
            {/* Square Icon Badge */}
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-rose-100/80 dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm">
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            {/* Step Counter Tag */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-zinc-500 uppercase">
              <span className="text-rose-500 font-bold">0{index + 1}</span>
              <span>/</span>
              <span>0{total}</span>
              <span>•</span>
              <span>AI PLATFORM</span>
            </div>

            {/* Feature Title */}
            <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              {feature.title}
            </h3>

            {/* Feature Description */}
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md">
              {feature.description}
            </p>
          </div>

          {/* Bottom Card Footer Links */}
          <div className="pt-4 flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 border-t border-rose-200/60 dark:border-zinc-800/60">
            <span>SHIKSHASETU FEATURE</span>
            <a href="/signup" className="text-zinc-900 dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition flex items-center gap-1 font-bold">
              <span>EXPLORE FEATURE</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right Column: Custom Visual Preview Graphic matching screenshot */}
        <div className="relative hidden md:flex h-full w-full items-center justify-center p-4">
          <FeatureVisualPreview index={index} title={feature.title} />
        </div>

      </div>
    </motion.div>
  );
}

function FeatureVisualPreview({ index, title }: { index: number; title: string }) {
  // Feature 3: PDF to Quiz (Matches uploaded screenshot!)
  if (index === 2) {
    return (
      <div className="relative w-full max-w-md h-64 flex items-center justify-center">
        {/* Document Card: Notes.pdf */}
        <div className="absolute left-0 top-2 w-48 rounded-2xl border border-white/80 bg-white/90 dark:bg-zinc-950 p-4 shadow-md backdrop-blur-sm space-y-2 z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Notes.pdf</span>
            <div className="h-5 w-5 rounded-md bg-rose-500 flex items-center justify-center text-[9px] font-bold text-white uppercase">
              PDF
            </div>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
          <div className="h-2 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
          <div className="h-2 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        </div>

        {/* Curved Dotted Arrow Graphic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-rose-300 dark:text-rose-800 opacity-70" viewBox="0 0 300 200" fill="none">
          <path d="M 120 70 Q 180 30 220 80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Quiz Result Card */}
        <div className="absolute right-0 bottom-2 w-52 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-4 shadow-lg backdrop-blur-sm space-y-2 z-20">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
            <span className="text-xs font-bold text-zinc-900 dark:text-white">Quiz</span>
            <div className="h-6 w-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <span>A</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-100/70 dark:bg-rose-950/60 font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <span>B</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <span>C</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <span>D</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Feature 1: AI Notes
  if (index === 0) {
    return (
      <div className="relative w-full max-w-md h-64 flex items-center justify-center">
        <div className="w-64 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-white">Executive Summary</span>
            <Sparkles className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Distilled 12 syllabus chapters into core formulas, key terms, and active recall points.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-mono uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-600 px-2 py-0.5 rounded-full font-bold">
              3D FLASHCARDS READY
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Feature 2: AI Quiz Generator
  if (index === 1) {
    return (
      <div className="relative w-full max-w-md h-64 flex items-center justify-center">
        <div className="w-64 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white">Adaptive Quiz</span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              90% SCORE
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            <div className="h-2 w-4/5 bg-rose-400 rounded-full" />
          </div>
          <p className="text-[11px] text-zinc-500">3 practice questions generated for target revision.</p>
        </div>
      </div>
    );
  }

  // Feature 4: AI Doubt Solver
  if (index === 3) {
    return (
      <div className="relative w-full max-w-md h-64 flex items-center justify-center space-y-2">
        <div className="w-64 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-4 shadow-lg space-y-2">
          <div className="flex justify-end">
            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2 text-[10px] text-zinc-700 dark:text-zinc-300">
              How does useEffect cleanup work?
            </div>
          </div>
          <div className="flex justify-start gap-2 items-start">
            <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="rounded-xl bg-rose-50/80 dark:bg-zinc-900 p-2.5 text-[10px] text-zinc-800 dark:text-zinc-200 border border-rose-200/60 dark:border-zinc-800">
              The cleanup function runs before the component unmounts...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Feature 5: Progress Tracking
  if (index === 4) {
    return (
      <div className="relative w-full max-w-md h-64 flex items-center justify-center">
        <div className="w-64 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="h-5 w-5 fill-amber-500/20" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">4 Days Streak</p>
              <p className="text-[10px] text-zinc-500">65% weekly target completed</p>
            </div>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-rose-500 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Default / Feature 6: Mock Tests
  return (
    <div className="relative w-full max-w-md h-64 flex items-center justify-center">
      <div className="w-64 rounded-2xl border border-white/80 bg-white/95 dark:bg-zinc-950 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-white">Mock Test Sprint</span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-rose-500 font-bold">
            <Clock className="h-3 w-3" />
            <span>10:00 MINS</span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Timed practice assessment with instant answer rationale.</p>
      </div>
    </div>
  );
}
