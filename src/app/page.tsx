'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const CHECK_ICON = (
  <svg className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const FEATURES = [
  {
    title: 'Verb Conjugation',
    description: 'Master French verb forms across CEFR levels with spaced repetition.',
    href: '/conjugation',
    badge: 'Free',
    badgeVariant: 'success' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
    features: ['60+ verbs across A1–B2', '8 tenses', 'Spaced repetition review', 'Level-up tests'],
  },
  {
    title: 'Translation',
    description: 'Translate English phrases to French across CEFR levels.',
    href: '/translation',
    badge: 'Free',
    badgeVariant: 'success' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
      </svg>
    ),
    features: ['100 phrases across A1–B2', 'Progressive difficulty', 'Accent-aware validation', 'Level-up progression'],
  },
  {
    title: 'Adjectives',
    description: 'Master feminine forms and adverbs across CEFR levels.',
    href: '/adverb',
    badge: 'Free',
    badgeVariant: 'success' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    features: ['140+ adjectives across A1–B2', 'Feminine + adverb forms', 'Accent-aware validation', 'Level-up progression'],
  },
  {
    title: 'Written Expression',
    description: 'Simulate the TCF written expression exam with AI-powered evaluation.',
    href: '/writing',
    badge: 'PRO',
    badgeVariant: 'warning' as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    features: ['3 timed tasks', 'AI evaluation & CEFR scoring', 'Detailed corrections', 'AI improved versions with diff'],
  },
];

const STATS = [
  { value: '60+', label: 'Verbs to master', sublabel: 'across all CEFR levels' },
  { value: '8', label: 'Tenses covered', sublabel: 'from présent to subjonctif' },
  { value: '140+', label: 'Adjectives', sublabel: 'with feminine & adverb forms' },
  { value: 'AI', label: 'Powered feedback', sublabel: 'for written expression' },
];

export default function LandingPage() {
  const { isPro } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center animate-fade-in-up">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground mb-8">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>TCF Exam Preparation Platform</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground text-balance max-w-4xl mx-auto">
              Master French for the TCF Exam
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Practice verb conjugation, written expression, and oral expression with AI-powered feedback — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/conjugation">
                <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Get Started Free
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  View Pricing
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {STATS.map((stat, index) => (
              <div key={index} className="py-8 px-6 text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground">
              Everything you need to prepare
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive suite of tools designed to help you succeed in every section of the TCF exam.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                      <Badge variant={feature.badgeVariant}>{feature.badge}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {CHECK_ICON}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link href={feature.href}>
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Start Practicing
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-6 flex justify-center">
            <Card className="max-w-md opacity-60 border-dashed">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">Oral Expression</h3>
                    <Badge variant="locked">Coming Soon</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Practice speaking with AI feedback for the TCF oral expression exam.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-muted">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            {/* Free Plan */}
            <Card className="relative">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground">Free</h3>
                <p className="mt-1 text-muted-foreground">Perfect to get started</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">€0</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Verb conjugation (A1–B2)',
                  'Translation practice (A1–B2)',
                  'Adjective practice (A1–B2)',
                  '8 tenses',
                  'Spaced repetition review',
                  'Level-up tests',
                  'Saved in browser',
                  'Export / Import',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    {CHECK_ICON}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/conjugation">
                <Button variant="secondary" className="w-full">Start Free</Button>
              </Link>
            </Card>

            {/* PRO Plan */}
            <Card className="relative ring-2 ring-primary shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold text-foreground">PRO</h3>
                  {isPro && <Badge variant="success">Active</Badge>}
                </div>
                <p className="mt-1 text-muted-foreground">Full TCF preparation</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">€4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Everything in Free',
                  'Written Expression + AI evaluation',
                  'CEFR scoring & corrections',
                  'AI improved versions with diff',
                  'Oral Expression (coming soon)',
                  'Saved in the cloud',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    {CHECK_ICON}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pro">
                <Button className="w-full">Go PRO</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground text-balance">
            Ready to master French?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of students preparing for the TCF exam with our comprehensive practice platform.
          </p>
          <div className="mt-10">
            <Link href="/conjugation">
              <Button size="lg" className="min-w-[200px]">
                Start Practicing Now
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-medium text-foreground">TCF Prep</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <Link href="/conjugation" className="text-muted-foreground hover:text-foreground transition-colors">
                Conjugation
              </Link>
              <Link href="/translation" className="text-muted-foreground hover:text-foreground transition-colors">
                Translation
              </Link>
              <Link href="/adverb" className="text-muted-foreground hover:text-foreground transition-colors">
                Adjectives
              </Link>
              <Link href="/writing" className="text-muted-foreground hover:text-foreground transition-colors">
                Writing
              </Link>
              <Link href="/pro" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              TCF Prep — Prepare for the TCF exam with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
