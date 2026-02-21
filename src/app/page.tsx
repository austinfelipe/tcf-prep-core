'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const CHECK_ICON = (
  <svg className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export default function LandingPage() {
  const { isPro } = useAuth();

  return (
    <div className="min-h-screen">
      <LandingHeader />

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <Badge variant="info">TCF Exam Preparation</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Master French for the TCF Exam
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Practice verb conjugation, written expression, and oral expression
            with AI-powered feedback — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/conjugation">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <a href="#pricing">
              <Button variant="secondary" size="lg">View Pricing</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Everything you need to prepare
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Verb Conjugation */}
            <Card className="flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
                <Badge variant="success">Free</Badge>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verb Conjugation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Master French verb forms across CEFR levels with spaced repetition.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">{CHECK_ICON} 60+ verbs across A1–B2</li>
                <li className="flex items-center gap-2">{CHECK_ICON} 8 tenses</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Spaced repetition review</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Level-up tests</li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/conjugation">
                  <Button variant="secondary" className="w-full">Start Practicing</Button>
                </Link>
              </div>
            </Card>

            {/* Written Expression */}
            <Card className="flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </div>
                <Badge variant="warning">PRO</Badge>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Written Expression</h3>
              <p className="mt-1 text-sm text-gray-500">
                Simulate the TCF written expression exam with AI-powered evaluation.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">{CHECK_ICON} 3 timed tasks</li>
                <li className="flex items-center gap-2">{CHECK_ICON} AI evaluation &amp; CEFR scoring</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Detailed corrections</li>
                <li className="flex items-center gap-2">{CHECK_ICON} AI improved versions with diff</li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/writing">
                  <Button variant="secondary" className="w-full">Try Writing</Button>
                </Link>
              </div>
            </Card>

            {/* Oral Expression */}
            <Card className="flex flex-col opacity-60">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                </div>
                <Badge variant="locked">Coming Soon</Badge>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Oral Expression</h3>
              <p className="mt-1 text-sm text-gray-500">
                Practice speaking with AI feedback for the TCF oral expression exam.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">{CHECK_ICON} 3 timed tasks</li>
                <li className="flex items-center gap-2">{CHECK_ICON} AI pronunciation feedback</li>
                <li className="flex items-center gap-2">{CHECK_ICON} CEFR level assessment</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-200 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Simple pricing
          </h2>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free */}
            <Card className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900">Free</h3>
              <p className="mt-1 text-sm text-gray-500">Perfect to get started</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">€0</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">{CHECK_ICON} Verb conjugation (A1–B2)</li>
                <li className="flex items-center gap-2">{CHECK_ICON} 8 tenses</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Spaced repetition review</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Level-up tests</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Saved in browser</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Export / Import</li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/conjugation">
                  <Button variant="secondary" className="w-full">Start Free</Button>
                </Link>
              </div>
            </Card>

            {/* PRO */}
            <Card className="flex flex-col border-2 border-blue-500">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">PRO</h3>
                {isPro && <Badge variant="success">Active</Badge>}
              </div>
              <p className="mt-1 text-sm text-gray-500">Full TCF preparation</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">€4.99</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">{CHECK_ICON} Everything in Free</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Written Expression + AI evaluation</li>
                <li className="flex items-center gap-2">{CHECK_ICON} CEFR scoring &amp; corrections</li>
                <li className="flex items-center gap-2">{CHECK_ICON} AI improved versions with diff</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Oral Expression (coming soon)</li>
                <li className="flex items-center gap-2">{CHECK_ICON} Saved in the cloud</li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/pro">
                  <Button className="w-full">Go PRO</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <p className="text-center text-sm text-gray-400">
          TCF Simulator — Prepare for the TCF exam with confidence.
        </p>
      </footer>
    </div>
  );
}
