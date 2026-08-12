'use client';

import Link from 'next/link';

type LogoProps = {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function LogoIcon({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ShikshaSetu Logo Icon"
    >
      {/* Pink Person Head Dot */}
      <circle cx="60" cy="24" r="11" fill="#FF5C93" />

      {/* Main Stylized 'S' Ribbon (Dark Charcoal) */}
      <path
        d="M 78 37 C 52 32, 34 46, 38 65 C 41 78, 62 82, 68 92 C 71 97, 68 103, 60 104 C 50 105, 38 98, 30 90 L 22 100 C 34 112, 50 116, 64 114 C 82 111, 88 95, 82 82 C 75 68, 52 64, 49 55 C 47 48, 55 42, 70 44 Z"
        fill="#18181B"
        className="dark:fill-white"
      />

      {/* Inner Pink Wing Swoosh */}
      <path
        d="M 58 56 C 68 64, 82 72, 88 84 C 74 96, 56 104, 38 100 C 52 92, 64 80, 58 56 Z"
        fill="#FF5C93"
      />

      {/* Open Book Base - Left Page */}
      <path
        d="M 20 90 Q 42 78 60 98 Q 42 90 20 102 Z"
        fill="#FF5C93"
      />
      <path
        d="M 20 100 Q 42 88 60 108 Q 42 100 20 112 Z"
        fill="#18181B"
        className="dark:fill-white"
      />

      {/* Open Book Base - Right Page */}
      <path
        d="M 100 90 Q 78 78 60 98 Q 78 90 100 102 Z"
        fill="#18181B"
        className="dark:fill-white"
      />
      <path
        d="M 100 100 Q 78 88 60 108 Q 78 100 100 112 Z"
        fill="#FF5C93"
      />
    </svg>
  );
}

export default function Logo({ className = '', showTagline = true }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 transition hover:opacity-95 ${className}`}>
      {/* Mobile & Desktop Icon Mark */}
      <div className="flex shrink-0 items-center justify-center">
        <LogoIcon className="h-9 w-9 sm:h-10 sm:w-10" />
      </div>

      {/* Desktop Full Logo Text */}
      <div className="hidden sm:flex flex-col justify-center">
        <div className="flex items-center text-xl sm:text-2xl font-bold tracking-tight leading-none">
          <span className="text-[#18181B] dark:text-white font-extrabold">Shiksha</span>
          <span className="text-[#FF5C93] font-extrabold">Setu</span>
        </div>

        {showTagline && (
          <div className="mt-1 flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-[0.22em] text-[#6B7280] uppercase leading-none">
            <span>LEARN</span>
            <span className="text-[#FF5C93]">•</span>
            <span>CONNECT</span>
            <span className="text-[#FF5C93]">•</span>
            <span>GROW</span>
          </div>
        )}
      </div>

      {/* Mobile Icon-only display text (shows compact brand text on mobile) */}
      <div className="flex sm:hidden flex-col justify-center">
        <div className="flex items-center text-lg font-bold tracking-tight leading-none">
          <span className="text-[#18181B] dark:text-white font-extrabold">Shiksha</span>
          <span className="text-[#FF5C93] font-extrabold">Setu</span>
        </div>
      </div>
    </Link>
  );
}
