'use client';

import { useReviewSession } from '@/hooks/useReviewSession';
import { ConjugationPrompt } from '@/components/practice/ConjugationPrompt';
import { AnswerInput } from '@/components/practice/AnswerInput';
import { FeedbackDisplay } from '@/components/practice/FeedbackDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export function ReviewSession() {
  const {
    phase,
    dueVerbCount,
    sessionSize,
    currentItem,
    currentIndex,
    sessionLength,
    score,
    lastResult,
    startSession,
    submitAnswer,
    nextQuestion,
    restartSession,
  } = useReviewSession();

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="mx-auto max-w-lg space-y-6 px-4 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No verbs due for review</h2>
        <p className="text-gray-600">
          Keep practicing! Verbs become available for review 2 days after you last practiced them.
        </p>
        <Link href="/conjugation">
          <Button variant="secondary">Back to Conjugation</Button>
        </Link>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-lg space-y-6 px-4 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review Session</h2>
        <p className="text-gray-600">
          {dueVerbCount} verb{dueVerbCount !== 1 ? 's' : ''} due for review.
          <br />
          You&apos;ll answer {sessionSize} question{sessionSize !== 1 ? 's' : ''} mixing combos from these verbs.
        </p>
        <Button onClick={startSession} size="lg">
          Start Review
        </Button>
      </div>
    );
  }

  if (phase === 'finished') {
    const percent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="mx-auto max-w-lg space-y-6 px-4 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review Complete!</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-4xl font-bold text-gray-900">{percent}%</div>
          <p className="mt-2 text-gray-600">
            {score.correct} correct out of {score.total}
          </p>
          <div className="mt-4 flex justify-center gap-8 text-sm">
            <div>
              <span className="text-2xl font-bold text-green-600">{score.correct}</span>
              <p className="text-gray-500">Correct</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-600">{score.incorrect}</span>
              <p className="text-gray-500">Incorrect</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={restartSession}>
            Review Again
          </Button>
          <Link href="/conjugation">
            <Button variant="secondary">Conjugation</Button>
          </Link>
        </div>
      </div>
    );
  }

  // in_progress
  const progressPercent =
    sessionLength > 0 ? Math.round(((currentIndex + (lastResult ? 1 : 0)) / sessionLength) * 100) : 0;

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{currentIndex + 1} / {sessionLength}</span>
        {currentItem && <Badge variant="info">{currentItem.levelId.toUpperCase()}</Badge>}
      </div>
      <ProgressBar value={progressPercent} color="blue" />

      {lastResult ? (
        <div className="space-y-4">
          <FeedbackDisplay result={lastResult.result} userAnswer={lastResult.userAnswer} />
          <div className="text-center">
            <Button onClick={nextQuestion}>
              {currentIndex + 1 >= sessionLength ? 'See Results' : 'Next Question'}
            </Button>
          </div>
        </div>
      ) : currentItem ? (
        <div className="space-y-6">
          <ConjugationPrompt
            infinitive={currentItem.verb.infinitive}
            translation={currentItem.verb.translation}
            tense={currentItem.tense}
            pronoun={currentItem.pronoun}
          />
          <AnswerInput onSubmit={submitAnswer} />
        </div>
      ) : null}
    </div>
  );
}
