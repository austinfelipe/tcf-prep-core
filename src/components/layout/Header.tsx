'use client';

import Link from 'next/link';

interface HeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export function Header({ title, backHref, backLabel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backLabel ?? 'Back'}
          </Link>
        )}
        {title && (
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
            {title}
          </h1>
        )}
        {backHref && <div className="w-12" />} {/* Spacer to center title */}
      </div>
    </header>
  );
}
