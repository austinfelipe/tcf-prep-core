'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  {
    title: 'Complete Written Expression',
    description:
      '3 timed tasks simulating the TCF exam',
  },
  {
    title: 'AI Evaluation',
    description:
      'Detailed correction with scores on 5 criteria and CEFR level',
  },
  {
    title: 'Improved Version',
    description:
      'AI suggests an improved version of your text with diff',
  },
  {
    title: 'Unlimited History',
    description:
      'Access all your past evaluations to track your progress',
  },
];

export default function ProPage() {
  const { user, isPro, isLoading, profile } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  async function handleSubscribe() {
    if (!user) {
      router.push('/login?redirect=/pro');
      return;
    }

    setIsRedirecting(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setIsRedirecting(false);
    }
  }

  async function handleManageSubscription() {
    setIsRedirecting(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setIsRedirecting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="PRO" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-lg px-4 py-8">
        {isPro ? (
          <>
            <div className="mb-8 text-center">
              <Badge variant="success">PRO Active</Badge>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                You&apos;re PRO!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                You have access to all written expression features.
              </p>
              {profile?.pro_until && (
                <p className="mt-1 text-xs text-gray-400">
                  Next renewal:{' '}
                  {new Date(profile.pro_until).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button onClick={() => router.push('/writing')}>
                Access Written Expression
              </Button>
              <Button
                variant="ghost"
                onClick={handleManageSubscription}
                disabled={isRedirecting}
              >
                {isRedirecting
                  ? 'Redirecting...'
                  : 'Manage my subscription'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Go PRO
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Unlock the written expression exam with AI evaluation
              </p>
            </div>

            <div className="mb-8 space-y-3">
              {FEATURES.map((feature) => (
                <Card key={feature.title}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-3 w-3 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={handleSubscribe}
                disabled={isRedirecting}
                className="w-full"
              >
                {isRedirecting
                  ? 'Redirecting to payment...'
                  : 'Subscribe \u2014 \u20ac4.99/month'}
              </Button>
              <p className="mt-3 text-xs text-gray-400">
                Cancel anytime from your subscriber area
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
