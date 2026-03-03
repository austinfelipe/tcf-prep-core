'use client';

import { useEffect } from 'react';
import { TranslationPhrase, TranslationLevelId } from '@/types/translation';
import { useTranslationPractice } from '@/hooks/useTranslationPractice';
import { TranslationPrompt } from './TranslationPrompt';
import { AnswerInput } from '@/components/practice/AnswerInput';
import { FeedbackDisplay } from '@/components/practice/FeedbackDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface TranslationSessionProps {
  phrases: TranslationPhrase[];
  levelId: TranslationLevelId;
}

export function TranslationSession({ phrases, levelId }: TranslationSessionProps) {
  const {
    isLoaded,
    state,
    nextQuestion,
    submitAnswer,
    allMastered,
    levelStats,
  } = useTranslationPractice(phrases, levelId);

  useEffect(() => {
    if (isLoaded && !state) {
      nextQuestion();
    }
  }, [isLoaded, state, nextQuestion]);

  if (!isLoaded || !state) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const granularPercent =
    levelStats.totalNeeded > 0
      ? Math.round((levelStats.totalCorrect / levelStats.totalNeeded) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {levelStats.totalCorrect} / {levelStats.totalNeeded} correct answers
          </span>
          <span>{granularPercent}%</span>
        </div>
        <ProgressBar
          value={granularPercent}
          color={allMastered ? 'green' : 'blue'}
        />
        <p className="text-xs text-gray-400">
          {levelStats.mastered} / {levelStats.total} phrases mastered (3 correct each at 66%+)
        </p>
      </div>

      {allMastered && (
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            Level complete!
          </p>
          <p className="text-sm text-green-600">
            You&apos;ve mastered all phrases in this level. Keep practicing to stay sharp!
          </p>
        </div>
      )}

      {/* Prompt */}
      <TranslationPrompt english={state.phrase.english} />

      {/* Answer / Feedback */}
      {state.result ? (
        <div className="space-y-4">
          <FeedbackDisplay result={state.result} userAnswer={state.userAnswer} />
          <Button onClick={nextQuestion} className="w-full" size="lg">
            Next Question
          </Button>
        </div>
      ) : (
        <AnswerInput onSubmit={submitAnswer} placeholder="Type translation..." />
      )}
    </div>
  );
}
