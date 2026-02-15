'use client';

import { useEffect } from 'react';
import { VerbEntry, Tense } from '@/types/conjugation';
import { LevelId } from '@/types/level';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { ConjugationPrompt } from './ConjugationPrompt';
import { AnswerInput } from './AnswerInput';
import { FeedbackDisplay } from './FeedbackDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface PracticeSessionProps {
  verb: VerbEntry;
  tenses: Tense[];
  levelId: LevelId;
}

export function PracticeSession({ verb, tenses, levelId }: PracticeSessionProps) {
  const {
    isLoaded,
    state,
    nextQuestion,
    submitAnswer,
    dominated,
    verbProgress,
  } = usePracticeSession(verb, tenses, levelId);

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

  // Granular progress: shows correct answers toward mastery (each combo needs 3)
  const granularPercent =
    verbProgress.totalNeeded > 0
      ? Math.round((verbProgress.totalCorrect / verbProgress.totalNeeded) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {verbProgress.totalCorrect} / {verbProgress.totalNeeded} correct answers
          </span>
          <span>{granularPercent}%</span>
        </div>
        <ProgressBar
          value={granularPercent}
          color={dominated ? 'green' : 'blue'}
        />
        <p className="text-xs text-gray-400">
          {verbProgress.mastered} / {verbProgress.total} combos mastered (3 correct each at 66%+)
        </p>
      </div>

      {dominated && (
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            Verb dominated!
          </p>
          <p className="text-sm text-green-600">
            You&apos;ve mastered all conjugations for this verb. Keep practicing to stay sharp!
          </p>
        </div>
      )}

      {/* Prompt */}
      <ConjugationPrompt
        infinitive={verb.infinitive}
        translation={verb.translation}
        tense={state.tense}
        pronoun={state.pronoun}
      />

      {/* Answer / Feedback */}
      {state.result ? (
        <div className="space-y-4">
          <FeedbackDisplay result={state.result} userAnswer={state.userAnswer} />
          <Button onClick={nextQuestion} className="w-full" size="lg">
            Next Question
          </Button>
        </div>
      ) : (
        <AnswerInput onSubmit={submitAnswer} />
      )}
    </div>
  );
}
