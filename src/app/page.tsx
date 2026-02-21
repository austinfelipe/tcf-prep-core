'use client';

import { useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { LEVELS } from '@/data/levels';
import { getVerbsByIds } from '@/data/conjugations';
import { getLevelCompletionPercent } from '@/lib/mastery';
import { exportProgress, parseProgressFile } from '@/lib/storage';
import { getReviewSummary, formatStaleness } from '@/lib/review';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  const { isPro } = useAuth();
  const { progress, isLoaded, resetAll, importProgress } = useProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        {/* Review */}
        {(() => {
          const reviewSummary = getReviewSummary(progress);
          const hasDue = reviewSummary.dueVerbCount > 0;
          const hasPracticed = reviewSummary.totalPracticedVerbs > 0;

          return (
            <div className="mt-8">
              <Link
                href={hasDue ? '/review' : '#'}
                className={!hasDue ? 'pointer-events-none' : ''}
              >
                <Card
                  hoverable={hasDue}
                  className={!hasDue ? 'opacity-60' : ''}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">Review</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {hasPracticed
                          ? 'Revisit verbs you haven\u2019t practiced in a while'
                          : 'Practice verbs to unlock review'}
                      </p>
                      {hasDue && (
                        <p className="mt-2 text-xs text-gray-400">
                          {reviewSummary.dueVerbCount} verb{reviewSummary.dueVerbCount !== 1 ? 's' : ''} due · oldest {formatStaleness(reviewSummary.oldestStalenessMs)} ago
                        </p>
                      )}
                    </div>
                    <div className="ml-2 mt-1">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          );
        })()}

        {/* Expression Ecrite */}
        <div className="mt-8">
          <Link href="/writing">
            <Card hoverable>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Written Expression
                    </h3>
                    {!isPro && <Badge variant="warning">PRO</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Simulate the TCF written expression exam: 3 timed tasks with AI evaluation
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    3 tasks · A1–C2 · AI Evaluation
                  </p>
                </div>
                <div className="ml-2 mt-1">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => exportProgress()}>
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            data-testid="import-file-input"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const incoming = await parseProgressFile(file);
                if (window.confirm('Import this progress file? This will replace your current progress.')) {
                  importProgress(incoming);
                }
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Invalid progress file.');
              }
              e.target.value = '';
            }}
          />
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
