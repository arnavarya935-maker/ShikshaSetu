'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, Grid, BookOpen, CheckCircle2, ClipboardList, BarChart3, CalendarDays, Users, Settings, LayoutDashboard, Globe, User, Sparkles } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNotifications } from '../lib/lms/hooks';
import { useLanguage } from '../lib/language/LanguageContext';
import NotificationBell from './lms/NotificationBell';
import DarkModeToggle from '../app/dark';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from './Logo';

export default function DashboardShell({ title, subtitle, breadcrumbs, children }: {

  title: string;
  subtitle: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { profile, logout, user } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications(user?.uid);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = useMemo(() => ({
    student: [
      { href: '/dashboard/student', label: t('dash_nav_dashboard'), icon: LayoutDashboard },
      { href: '/dashboard/student/courses', label: t('dash_nav_my_courses'), icon: BookOpen },
      { href: '/courses', label: t('dash_nav_explore'), icon: BookOpen },
      { href: '/dashboard/student/path', label: t('dash_nav_learning_path'), icon: CheckCircle2 },
      { href: '/dashboard/student/progress', label: t('dash_nav_progress'), icon: BarChart3 },
      { href: '/dashboard/student/assignments', label: t('dash_nav_assignments'), icon: ClipboardList },
      { href: '/dashboard/student/tools', label: t('dash_nav_study_tools'), icon: Grid },
      { href: '/dashboard/student/profile', label: t('dash_nav_profile'), icon: Users },
      { href: '/dashboard/student/settings', label: t('dash_nav_settings'), icon: Settings },
    ],
    teacher: [
      { href: '/dashboard/teacher', label: t('dash_nav_dashboard'), icon: LayoutDashboard },
      { href: '/dashboard/teacher/courses', label: t('dash_nav_my_courses'), icon: BookOpen },
      { href: '/dashboard/teacher/students', label: 'Students', icon: Users },
      { href: '/dashboard/teacher/assignments', label: t('dash_nav_assignments'), icon: ClipboardList },
      { href: '/dashboard/teacher/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/dashboard/teacher/schedule', label: 'Schedule', icon: CalendarDays },
      { href: '/dashboard/teacher/tools', label: t('dash_nav_study_tools'), icon: Grid },
      { href: '/dashboard/teacher/profile', label: t('dash_nav_profile'), icon: Users },
      { href: '/dashboard/teacher/settings', label: t('dash_nav_settings'), icon: Settings },
    ],
    admin: [
      { href: '/dashboard/admin', label: t('dash_nav_dashboard'), icon: LayoutDashboard },
      { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
      { href: '/dashboard/admin/students', label: 'Manage Students', icon: Users },
      { href: '/dashboard/admin/teachers', label: 'Manage Teachers', icon: Users },
      { href: '/dashboard/admin/courses', label: 'Manage Courses', icon: BookOpen },
      { href: '/dashboard/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
      { href: '/dashboard/admin/settings', label: t('dash_nav_settings'), icon: Settings },
    ],
  }), [t]);

  const links = useMemo(() => {
    if (profile?.role === 'teacher') return navLinks.teacher;
    if (profile?.role === 'admin') return navLinks.admin;
    return navLinks.student;
  }, [profile?.role, navLinks]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const sidebarClass = clsx(
    "rounded-[2rem] border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 p-5 shadow-soft transition-all duration-300",
    menuOpen
      ? "fixed left-4 top-[85px] bottom-4 z-50 w-[270px] overflow-y-auto block shadow-2xl animate-in slide-in-from-left duration-300 md:static md:z-0 md:w-auto md:h-auto md:shadow-soft"
      : "hidden md:block md:static md:w-auto md:h-auto"
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="relative z-30 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-700 dark:text-zinc-200 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">{t('dash_sidebar_title')}</p>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
            </div>
          </div>

          {/* Mobile Header elements */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-700 dark:text-zinc-200"
            >
              <Globe className="h-4 w-4" />
            </button>
            <DarkModeToggle />
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {/* Language Selector */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <DarkModeToggle />
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={markAsRead}
            />
            
            {/* Avatar + name + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition shadow-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase shadow-sm">
                  {profile?.name ? profile.name.substring(0, 2) : 'LE'}
                </div>
                <span className="hidden font-semibold sm:block max-w-[120px] truncate text-zinc-900 dark:text-white">
                  {profile?.name ?? 'Learner'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-elevated focus:outline-none z-50"
                  >
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/60 mb-1">
                      <p className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">{t('dash_profile_dropdown_signed_in')}</p>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-0.5">{profile?.name ?? 'Learner'}</p>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{profile?.role === 'teacher' ? t('dash_role_teacher') : profile?.role === 'admin' ? t('dash_role_admin') : t('dash_role_student')}</p>
                    </div>
                    
                    <Link
                      href={profile?.role === 'admin' ? '/dashboard/admin/settings' : `/dashboard/${profile?.role || 'student'}/profile`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      {t('dash_profile_link')}
                    </Link>
                    
                    <Link
                      href={profile?.role === 'admin' ? '/dashboard/admin/settings' : `/dashboard/${profile?.role || 'student'}/settings`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      {t('dash_nav_settings')}
                    </Link>
                    
                    <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/60" />
                    
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      type="button"
                      className="flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                    >
                      {t('nav_logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        {/* Mobile backdrop overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <aside className={sidebarClass}>
          <div className="mb-6 px-2">
            <Logo />
          </div>


          <nav className="space-y-1">
            {links.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative flex items-center px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ease-in-out rounded-full overflow-hidden z-10",
                    isActive
                      ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/80 font-bold"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className={clsx("mr-2.5 h-4 w-4", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500")} /> 
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-6 shadow-soft relative overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-400 font-semibold">Breadcrumbs</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.label} className="inline-flex items-center gap-1.5">
                      {crumb.href ? <Link href={crumb.href} className="transition hover:text-zinc-900 dark:hover:text-white">{crumb.label}</Link> : <span className="text-zinc-900 dark:text-white font-semibold">{crumb.label}</span>}
                      {index < breadcrumbs.length - 1 ? <span className="text-zinc-300 dark:text-zinc-700">/</span> : null}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-white">{title}</span>
                </div>
                <Link
                  href={profile?.role === 'admin' ? '/dashboard/admin/settings' : `/dashboard/${profile?.role || 'student'}/profile`}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm"
                >
                  <User className="h-3.5 w-3.5 text-zinc-400" /> {t('dash_profile_link')}
                </Link>
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 relative z-10 leading-relaxed">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

