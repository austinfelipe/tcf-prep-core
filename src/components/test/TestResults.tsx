'use client';

import { TestAnswer } from '@/hooks/useTestSession';
import { TENSE_DISPLAY_NAMES, Tense } from '@/types/conjugation';
import { PRONOUN_DISPLAY } from '@/data/pronouns';
import type { Pronoun } from '@/types/conjugation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface TestResultsProps {
  answers: TestAnswer[];
  score: { correct: number; total: number };
  passed: boolean;
  levelId: string;
  nextLevelId: string | null;
}

export function TestResults({ answers, score, passed, levelId, nextLevelId }: TestResultsProps) {
  const percent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Score banner */}
      <div
        className={`rounded-xl p-6 text-center ${
          passed
            ? 'border-2 border-green-300 bg-green-50'
            : 'border-2 border-red-300 bg-red-50'
        }`}
      >
        <div className="text-5xl font-bold">
          <span className={passed ? 'text-green-700' : 'text-red-700'}>
            {percent}%
          </span>
        </div>
        <p className="mt-2 text-lg font-semibold">
          {passed ? (
            <span className="text-green-800">Congratulations! You passed!</span>
          ) : (
            <span className="text-red-800">Not quite — 80% needed to pass</span>
          )}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {score.correct} correct out of {score.total} questions
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={`/level/${levelId}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Back to Tree
          </Button>
        </Link>
        {passed && nextLevelId && (
          <Link href={`/level/${nextLevelId}`} className="flex-1">
            <Button variant="primary" className="w-full">
              Start {nextLevelId.toUpperCase()}
            </Button>
          </Link>
        )}
        {!passed && (
          <Link href={`/level/${levelId}`} className="flex-1">
            <Button variant="primary" className="w-full">
              Keep Practicing
            </Button>
          </Link>
        )}
      </div>

      {/* Answer review */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Review</h3>
        <div className="space-y-1.5">
          {answers.map((a, i) => {
            const pronounDisplay = PRONOUN_DISPLAY[a.question.pronoun as Pronoun] ?? a.question.pronoun;
            const tenseDisplay = TENSE_DISPLAY_NAMES[a.question.tense as Tense];
            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  a.result.correct
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <div>
                  <span className="font-medium">{a.question.infinitive}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span>{tenseDisplay}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span>{pronounDisplay}</span>
                </div>
                <div className="text-right">
                  {a.result.correct ? (
                    <span>{a.result.expected}</span>
                  ) : (
                    <span>
                      <span className="line-through">{a.userAnswer}</span>
                      {' → '}
                      <span className="font-medium">{a.result.expected}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
