'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

export function LandingHeader() {
  const { user, isPro, isLoading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          TCF Simulator
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/conjugation"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Conjugation
          </Link>
          <Link
            href="/writing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Writing
          </Link>
          <a
            href="#pricing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Pricing
          </a>

          {!isLoading && (
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {isPro && <Badge variant="warning">PRO</Badge>}
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
