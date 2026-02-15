'use client';

import { use } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { getLevelById, LEVELS } from '@/data/levels';
import { getVerbsByIds } from '@/data/conjugations';
import { areAllVerbsDominated, getLevelCompletionPercent } from '@/lib/mastery';
import { Header } from '@/components/layout/Header';
import { VerbTree } from '@/components/tree/VerbTree';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = use(params);
  const { progress, isLoaded } = useProgress();
  const level = getLevelById(levelId);

  if (!level) return notFound();

  if (!isLoaded || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const levelProgress = progress.levels[level.id];
  const verbs = getVerbsByIds(level.verbIds);
  const allDominated = areAllVerbsDominated(levelProgress, verbs, level.tenses);
  const completionPercent = getLevelCompletionPercent(levelProgress, verbs, level.tenses);

  return (
    <div className="min-h-screen">
      <Header
        title={`${level.label} – Conjugation`}
        backHref="/"
        backLabel="Levels"
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Level progress summary */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{level.description}</span>
            <span className="font-semibold">{completionPercent}%</span>
          </div>
          <ProgressBar
            value={completionPercent}
            color={levelProgress.testPassed ? 'green' : 'blue'}
          />
        </div>

        {/* Test CTA */}
        {allDominated && !levelProgress.testPassed && (
          <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-center">
            <p className="mb-2 font-semibold text-amber-800">
              All verbs dominated! Ready for the test?
            </p>
            <Link href={`/level/${level.id}/test`}>
              <Button variant="accent">Take Level Test</Button>
            </Link>
          </div>
        )}

        {levelProgress.testPassed && (
          <div className="mb-6 rounded-xl border-2 border-green-300 bg-green-50 p-4 text-center">
            <p className="font-semibold text-green-800">
              Level {level.label} passed!
            </p>
            <Link href={`/level/${level.id}/test`}>
              <Button variant="ghost" size="sm" className="mt-1">
                Retake Test
              </Button>
            </Link>
          </div>
        )}

        {/* Verb tree */}
        <div className="flex justify-center overflow-x-auto pb-20">
          <VerbTree
            verbs={verbs}
            tenses={level.tenses}
            levelId={level.id}
            levelProgress={levelProgress}
          />
        </div>
      </main>
    </div>
  );
}
