"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";

interface HeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export function Header({ title, backHref, backLabel }: HeaderProps) {
  const { user, isPro, isLoading, signOut } = useAuth();

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
            {backLabel ?? "Back"}
          </Link>
        )}
        {title && (
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
            {title}
          </h1>
        )}

        {/* User menu */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {isPro && <Badge variant="warning">PRO</Badge>}
                <button
                  onClick={() => signOut()}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Se connecter
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
