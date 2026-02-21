'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ProSuccessPage() {
  const { isPro, isLoading, refreshProfile } = useAuth();
  const router = useRouter();

  // Poll profile until PRO status is confirmed (webhook may take a moment)
  useEffect(() => {
    if (isPro) return;

    const interval = setInterval(() => {
      refreshProfile();
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPro, refreshProfile]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Welcome PRO" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-lg px-4 py-12">
        <div className="text-center">
          {isPro ? (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>

              <Badge variant="success">PRO Active</Badge>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Payment confirmed!
              </h2>
              <p className="mt-2 text-gray-500">
                You now have access to written expression with AI evaluation.
              </p>

              <div className="mt-8">
                <Button onClick={() => router.push('/writing')}>
                  Start Written Expression
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-sm text-gray-500">
                  Activating your subscription...
                </p>
                <p className="text-xs text-gray-400">
                  This may take a few seconds.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
