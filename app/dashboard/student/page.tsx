'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Zap, PlayCircle } from 'lucide-react';
import RoleProtectedRoute from '../../../components/RoleProtectedRoute';
import DashboardShell from '../../../components/DashboardShell';
import DashboardCard from '../../../components/DashboardCard';
import { useAuth } from '../../../components/AuthProvider';
import DonutChart from '../../../components/lms/DonutChart';
import MiniCalendar from '../../../components/lms/MiniCalendar';
import { useLanguage } from '../../../lib/language/LanguageContext';
import { motion } from 'framer-motion';
import UserProfileCard from '../../../components/UserProfileCard';


const MotionLink = motion(Link);

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const greetingKey = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'greet_morning';
    if (hour >= 12 && hour < 17) return 'greet_afternoon';
    return 'greet_evening';
  }, []);

  const donutData = useMemo(() => [
    { label: 'UX Design', value: 45, color: '#6366F1' },
    { label: 'UI Design', value: 35, color: '#EC4899' },
    { label: '3D Design', value: 20, color: '#F59E0B' },
  ], []);

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell title={t('dash_nav_dashboard')} subtitle="Track courses, progress, and activities in one learning hub." breadcrumbs={[{ label: t('dash_nav_dashboard') }]}>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-6"
          >
            
            {/* Hero Banner with illustration */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 relative overflow-hidden shadow-soft flex items-center justify-between">
              <div className="relative z-10 max-w-md">
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                  {t(greetingKey)} {profile?.name ? profile.name.split(' ')[0] : 'Vicky'}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('student_goal_desc')}
                </p>
              </div>
              <div className="relative z-10 hidden sm:block">
                <img
                  src="/student_study_3d.png"
                  alt="Study illustration"
                  className="h-28 md:h-32 object-contain"
                />
              </div>
              {/* Left vertical gradient bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-pink-500 to-orange-500" />
            </div>

            {/* Your Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-850 dark:text-white">{t('student_courses_title')}</h2>
                <Link href="/dashboard/student/courses" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('student_view_all')}
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Course Card 1 */}
                <Link href="/dashboard/student/courses">
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.015 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft border-l-4 border-l-indigo-500 flex flex-col justify-between h-40 relative group cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-855 dark:text-white">User Experience</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Jony Deo</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-indigo-500">Master King</span>
                      <span className="text-lg text-indigo-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                </Link>

                {/* Course Card 2 */}
                <Link href="/dashboard/student/courses">
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.015 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft border-l-4 border-l-pink-500 flex flex-col justify-between h-40 relative group cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-855 dark:text-white">User Interface</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Jasmine</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-pink-500">Intermediate</span>
                      <span className="text-lg text-pink-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                </Link>

                {/* Course Card 3 */}
                <Link href="/dashboard/student/courses">
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.015 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft border-l-4 border-l-orange-500 flex flex-col justify-between h-40 relative group cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-855 dark:text-white">3D Designs</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Jasmine</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-orange-400">Beginner</span>
                      <span className="text-lg text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Statistics and Learning Progress row */}
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Progress Statistic" description="Target completion by track.">
                <div className="pt-2">
                  <DonutChart
                    value={65}
                    data={donutData}
                  />
                </div>
              </DashboardCard>

              <DashboardCard title="Learning Progress" description="Key training modules overview.">
                <div className="space-y-5 pt-3">
                  {/* Progress Item 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>UX Research and Development</span>
                      <span>80%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  {/* Progress Item 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>Visual Design and Development</span>
                      <span>70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>

                  {/* Progress Item 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>3D Design Concepts</span>
                      <span>50%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Enterprise Profile Card */}
            <UserProfileCard className="mx-auto" />

            {/* Calendar widget */}
            <div>

              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-855 dark:text-white">{t('student_schedule_title')}</h3>
              </div>
              <MiniCalendar 
                highlightedDays={[7, 12, 21]} 
              />
            </div>

            {/* Quick Link Cards */}
            <div className="space-y-3">
              {/* Upcoming Courses Button */}
              <MotionLink
                href="/dashboard/student/courses"
                whileHover={{ y: -2, scale: 1.015 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft hover:border-indigo-400 dark:hover:border-indigo-500 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                    <PlayCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('student_upcoming_courses')}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* Event Activities Button */}
              <MotionLink
                href="/dashboard/student/tools"
                whileHover={{ y: -2, scale: 1.015 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft hover:border-pink-400 dark:hover:border-pink-500 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-950/40">
                    <Zap className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('student_event_activities')}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </MotionLink>
            </div>


          </motion.div>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
