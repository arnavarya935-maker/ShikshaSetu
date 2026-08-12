'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/language/LanguageContext';

import Logo from './Logo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950 px-6 py-16 sm:px-10 lg:px-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_0.7fr] lg:items-start">
          <div className="space-y-4">
            <Logo />

            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t('footer_desc')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-white">{t('footer_col_product')}</h3>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <Link href="/#features" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('feat_ai_notes_title')}</Link>
              <Link href="/#features" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('feat_ai_quiz_title')}</Link>
              <Link href="/#features" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('feat_progress_title')}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-white">{t('footer_col_resources')}</h3>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <Link href="/#faqs" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('nav_faqs')}</Link>
              <Link href="/#features" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('nav_features')}</Link>
              <Link href="/#newsletter" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('nav_updates')}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-white">{t('footer_col_company')}</h3>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <Link href="/about" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_about')}</Link>
              <Link href="/contact" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_contact')}</Link>
              <Link href="/about" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_careers')}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-white">{t('footer_col_legal')}</h3>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <Link href="/privacy" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_privacy')}</Link>
              <Link href="/terms" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_terms')}</Link>
              <Link href="/terms" className="block hover:text-zinc-900 dark:hover:text-white transition">{t('footer_link_cookies')}</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <span>{t('footer_copyright')}</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">✦ SYNTHAI DESIGN SYSTEM</span>
        </div>
      </div>
    </footer>
  );
}

