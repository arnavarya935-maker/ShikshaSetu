'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, SearchX } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg text-center space-y-8"
        >
          {/* Animated icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10"
          >
            <SearchX className="h-10 w-10 text-violet-400" />
          </motion.div>

          {/* Error code */}
          <div>
            <p className="text-7xl font-black tracking-tight text-white sm:text-8xl">404</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Page not found
            </p>
          </div>

          {/* Description */}
          <p className="mx-auto max-w-md text-base leading-7 text-slate-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
