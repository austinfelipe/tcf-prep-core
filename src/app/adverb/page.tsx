'use client';

import { useEffect } from 'react';
import { useAdverbProgress } from '@/hooks/useAdverbProgress';
import { ADVERB_LEVELS, getAdjectivesForLevel } from '@/data/adverbs';
import { getAdverbLevelCompletion, areAllAdjectivesMastered } from '@/lib/adverbMastery';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { AdverbLevelId } from '@/types/adverb';

const LEVEL_ORDER: AdverbLevelId[] = ['a1', 'a2', 'b1', 'b2'];

export default function AdverbPage() {
  const { progress, isLoaded, unlock, resetAll } = useAdverbProgress();

  // Auto-unlock next level when current is mastered
  useEffect(() => {
    if (!progress) return;

    for (let i = 0; i < LEVEL_ORDER.length - 1; i++) {
      const currentId = LEVEL_ORDER[i];
      const nextId = LEVEL_ORDER[i + 1];
      const currentAdjectives = getAdjectivesForLevel(currentId);
      const currentProgress = progress.levels[currentId];
      const nextProgress = progress.levels[nextId];

      if (
        currentProgress.unlocked &&
        !nextProgress.unlocked &&
        areAllAdjectivesMastered(currentProgress, currentAdjectives)
      ) {
        unlock(nextId);
      }
    }
  }, [progress, unlock]);

  if (!isLoaded || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="TCF Prep" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Adjectives</h2>
          <p className="mt-1 text-gray-500">
            Master feminine forms and adverbs across 4 CEFR levels
          </p>
        </div>

        <div className="space-y-4">
          {ADVERB_LEVELS.map((level) => {
            const levelProgress = progress.levels[level.id];
            const adjectives = getAdjectivesForLevel(level.id);
            const completion = getAdverbLevelCompletion(
              levelProgress,
              adjectives,
            );
            const isUnlocked = levelProgress.unlocked;

            return (
              <Link
                key={level.id}
                href={isUnlocked ? `/adverb/${level.id}` : '#'}
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
                        {completion.percent === 100 && (
                          <Badge variant="success">Complete</Badge>
                        )}
                        {!isUnlocked && <Badge variant="locked">Locked</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {level.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {level.adjectiveIds.length} adjectives
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {completion.percent}%
                      </span>
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="mt-3">
                      <ProgressBar
                        value={completion.percent}
                        color={completion.percent === 100 ? 'green' : 'blue'}
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all adjective progress? This cannot be undone.')) {
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
