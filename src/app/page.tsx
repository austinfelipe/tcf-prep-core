'use client';

import { useProgress } from '@/hooks/useProgress';
import { LEVELS } from '@/data/levels';
import { getVerbsByIds } from '@/data/conjugations';
import { getLevelCompletionPercent } from '@/lib/mastery';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  const { progress, isLoaded, resetAll } = useProgress();

  if (!isLoaded || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="TCF Prep" />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">French Conjugation</h2>
          <p className="mt-1 text-gray-500">
            Master verb conjugations across 4 CEFR levels
          </p>
        </div>

        <div className="space-y-4">
          {LEVELS.map((level) => {
            const levelProgress = progress.levels[level.id];
            const verbs = getVerbsByIds(level.verbIds);
            const completionPercent = getLevelCompletionPercent(
              levelProgress,
              verbs,
              level.tenses
            );
            const isUnlocked = levelProgress.unlocked;
            const isPassed = levelProgress.testPassed;

            return (
              <Link
                key={level.id}
                href={isUnlocked ? `/level/${level.id}` : '#'}
                className={!isUnlocked ? 'pointer-events-none' : ''}
              >
                <Card
                  hoverable={isUnlocked}
                  className={`${!isUnlocked ? 'opacity-60' : ''} mb-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {level.label}
                        </h3>
                        {isPassed && <Badge variant="success">Passed</Badge>}
                        {!isUnlocked && <Badge variant="locked">Locked</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {level.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {level.verbIds.length} verbs · {level.tenses.length} tenses
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {completionPercent}%
                      </span>
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="mt-3">
                      <ProgressBar
                        value={completionPercent}
                        color={isPassed ? 'green' : 'blue'}
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all progress? This cannot be undone.')) {
                resetAll();
              }
            }}
          >
            Reset Progress
          </Button>
        </div>
      </main>
    </div>
  );
}
