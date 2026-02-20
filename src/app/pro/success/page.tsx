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
      <Header title="Bienvenue PRO" backHref="/" backLabel="Accueil" />

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

              <Badge variant="success">PRO actif</Badge>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Paiement confirmé !
              </h2>
              <p className="mt-2 text-gray-500">
                Vous avez maintenant accès à l&apos;expression écrite avec
                évaluation par IA.
              </p>

              <div className="mt-8">
                <Button onClick={() => router.push('/writing')}>
                  Commencer l&apos;expression écrite
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-sm text-gray-500">
                  Activation de votre abonnement en cours...
                </p>
                <p className="text-xs text-gray-400">
                  Cela peut prendre quelques secondes.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
