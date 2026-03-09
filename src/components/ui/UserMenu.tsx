'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

export function UserMenu() {
  const { user, isPro, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  if (isLoading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.email?.[0] ?? '?').toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 ${
          isPro ? 'bg-amber-500' : 'bg-blue-600'
        }`}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          <div className="px-4 py-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.email}
            </p>
            {isPro && (
              <Badge variant="warning" className="mt-1">PRO</Badge>
            )}
          </div>
          <div className="my-1 h-px bg-gray-100" />
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
