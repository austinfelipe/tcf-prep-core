'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserMenu } from '@/components/ui/UserMenu';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '/conjugation', label: 'Conjugation' },
  { href: '/translation', label: 'Translation' },
  { href: '/adverb', label: 'Adjectives' },
  { href: '/writing', label: 'Writing' },
  { href: '#pricing', label: 'Pricing', isAnchor: true },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-serif text-xl font-medium text-foreground hover:opacity-80 transition-opacity"
        >
          TCF Prep
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.isAnchor ? (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <UserMenu />
          <Link href="/pro">
            <Button size="sm">Go PRO</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-1 py-2">
            {NAV_LINKS.map((link) =>
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
          <div className="border-t border-border pt-4 flex flex-col gap-3">
            <UserMenu />
            <Link href="/pro" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Go PRO</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
