'use client';

import Link from 'next/link';
import { Menu, X, LayoutDashboard, LogOut, Globe, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import DarkModeToggle from '../app/dark';
import { useAuth } from './AuthProvider';
import { useLanguage } from '../lib/language/LanguageContext';

import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('/#features');
  const { user, profile, loading, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const isLoggedIn = !loading && !!user;

  const navItems = [
    { href: '/#features', label: t('nav_features') },
    { href: '/#faqs', label: t('nav_faqs') },
    { href: '/#newsletter', label: t('nav_updates') }
  ];

  useEffect(() => {
    const sections = navItems
      .map((item) => {
        const hash = item.href.includes('#') ? item.href.substring(item.href.indexOf('#')) : '';
        return hash ? document.querySelector(hash) : null;
      })
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`/#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [language]);

  const userInitials = profile?.name
    ? profile.name.substring(0, 2).toUpperCase()
    : user?.displayName
      ? user.displayName.substring(0, 2).toUpperCase()
      : 'U';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Logo />

        
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-xs font-semibold tracking-[0.15em] uppercase transition ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-zinc-900 dark:bg-white" />
                )}
              </a>
            );
          })}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
          >
            <Globe className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          <DarkModeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-4 py-2 text-xs font-medium !text-white dark:!text-[#171717] transition-colors shadow-none"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {t('nav_dashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] dark:bg-zinc-100 text-xs font-bold !text-white dark:!text-zinc-900">
                  {userInitials}
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 p-2 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-medium text-[#171717] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-none"
              >
                {t('nav_login')}
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-4 py-2 text-xs font-medium !text-white dark:!text-[#171717] transition-colors shadow-none"
              >
                {t('nav_signup')} ↗
              </Link>
            </div>
          )}

        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
          </button>
          <DarkModeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-zinc-700 dark:text-zinc-200 border border-[#DCDCDC] dark:border-zinc-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-xs font-semibold tracking-widest uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-900"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t('nav_dashboard')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); logout(); }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DCDCDC] dark:border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav_logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-[#DCDCDC] dark:border-zinc-800 text-center px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 text-center px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-900"
                  >
                    {t('nav_signup')} ↗
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

    </header>
  );
}

