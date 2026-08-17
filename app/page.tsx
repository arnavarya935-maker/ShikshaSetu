'use client';

import Link from 'next/link';
import { BarChart3, BookOpen, ClipboardList, FileText, MessagesSquare, Sparkles, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import FeaturesSection from '../components/FeaturesSection';
import FaqItem from '../components/FaqItem';
import NewsletterForm from '../components/NewsletterForm';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import AnimatedSection from '../components/AnimatedSection';
import { useLanguage } from '../lib/language/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { title: t('feat_ai_notes_title'), description: t('feat_ai_notes_desc'), icon: Sparkles },
    { title: t('feat_ai_quiz_title'), description: t('feat_ai_quiz_desc'), icon: BookOpen },
    { title: t('feat_pdf_title'), description: t('feat_pdf_desc'), icon: FileText },
    { title: t('feat_doubt_title'), description: t('feat_doubt_desc'), icon: MessagesSquare },
    { title: t('feat_progress_title'), description: t('feat_progress_desc'), icon: BarChart3 },
    { title: t('feat_mock_title'), description: t('feat_mock_desc'), icon: ClipboardList }
  ];

  const faqs = [
    { question: t('faq_q1'), answer: t('faq_a1') },
    { question: t('faq_q2'), answer: t('faq_a2') },
    { question: t('faq_q3'), answer: t('faq_a3') }
  ];

  return (
    <main className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Navbar />

      <HeroSection />

      <FeaturesSection features={features} />


      {/* Focus Section: Image 3 callout banner style */}
      <AnimatedSection className="px-6 py-20 sm:px-10 lg:px-16 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/40 p-8 sm:p-12 lg:p-16 shadow-soft">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs font-mono font-medium tracking-[0.18em] uppercase text-zinc-700 dark:text-zinc-300">
                <span>✦</span>
                <span>{t('focus_span')}</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                {t('focus_heading')}
              </h2>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t('focus_desc')}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-900 shadow-sm transition hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98]">
                  <span>{t('hero_cta_start')}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 transition hover:border-zinc-400 dark:hover:border-zinc-600">
                  {t('nav_login')}
                </Link>
              </div>
              <div className="mt-8 rounded-[2rem] overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="https://loremflickr.com/800/400/education,technology?lock=1" 
                  alt="Futuristic Workspace" 
                  className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">{t('focus_span')}</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t('focus_workspace_title')}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[t('focus_feat_1'), t('focus_feat_2'), t('focus_feat_3'), t('focus_feat_4')].map((item) => (
                    <div key={item} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Preview Section */}
      <AnimatedSection className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-zinc-200/90 dark:border-zinc-800/80 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-8 sm:p-12 lg:p-16 shadow-soft">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs font-mono font-medium tracking-[0.18em] uppercase text-zinc-700 dark:text-zinc-300">
                <span>✦</span>
                <span>{t('preview_span')}</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                {t('preview_heading')}
              </h2>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t('preview_desc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[t('preview_tag_1'), t('preview_tag_2'), t('preview_tag_3')].map((item) => (
                  <span key={item} className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-900 shadow-sm transition hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98]">
                  <span>{t('hero_cta_start')}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 transition hover:border-zinc-400 dark:hover:border-zinc-600">
                  {t('nav_login')}
                </Link>
              </div>
              <div className="mt-8 rounded-[2rem] overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="https://loremflickr.com/800/400/education,dashboard?lock=2" 
                  alt="AI Dashboard Preview" 
                  className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-mono font-medium uppercase text-zinc-500">{t('hero_stat_tools')}</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t('preview_board_title')}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[t('feat_ai_notes_title'), t('feat_mock_title'), t('feat_pdf_title'), t('feat_progress_title')].map((item) => (
                    <div key={item} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Popular Courses Section */}
      <AnimatedSection id="courses" className="px-6 py-20 sm:px-10 lg:px-16 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Featured Courses" subtitle="Explore our most popular AI-enhanced learning paths and interactive curriculums." />
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 1, title: 'Advanced Mathematics', category: 'Science', img: 'https://loremflickr.com/800/600/mathematics,education?lock=10' },
              { id: 2, title: 'Computer Science Fundamentals', category: 'Technology', img: 'https://loremflickr.com/800/600/computer,coding?lock=11' },
              { id: 3, title: 'Business & Entrepreneurship', category: 'Business', img: 'https://loremflickr.com/800/600/business,students?lock=12' },
            ].map((course) => (
              <div key={course.id} className="group rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden hover:shadow-2xl transition-shadow duration-500 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent z-10" />
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Master the core concepts with interactive lessons, AI quizzes, and real-world projects.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-900 dark:text-white">42 Lessons</span>
                    <span className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Learn more →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-900 shadow-sm transition hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98]">
              View All Courses
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection id="faqs" className="border-t border-zinc-200/80 dark:border-zinc-800/80 px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title={t('faq_heading')} subtitle={t('faq_subheading')} />
          <div className="mt-12 space-y-2">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Newsletter / CTA Section */}
      <AnimatedSection id="newsletter" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/40 p-8 sm:p-12 shadow-elevated">
          <NewsletterForm />
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}

