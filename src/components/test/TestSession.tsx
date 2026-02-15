'use client';

import { LevelDefinition } from '@/types/level';
import { VerbEntry } from '@/types/conjugation';
import { useTestSession } from '@/hooks/useTestSession';
import { TestQuestionComponent } from './TestQuestion';
import { TestResults } from './TestResults';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface TestSessionProps {
  level: LevelDefinition;
  verbs: VerbEntry[];
  nextLevelId: string | null;
}

export function TestSession({ level, verbs, nextLevelId }: TestSessionProps) {
  const {
    isLoaded,
    phase,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    score,
    passed,
    startTest,
    submitAnswer,
  } = useTestSession(level, verbs);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-lg space-y-6 px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {level.label} Level Test
        </h2>
        <p className="text-gray-600">
          {level.testQuestionCount} questions across all verbs and tenses.
          <br />
          You need <strong>80%</strong> to pass and unlock the next level.
        </p>
        <Button onClick={startTest} size="lg">
          Start Test
        </Button>
      </div>
    );
  }

  if (phase === 'finished') {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <TestResults
          answers={answers}
          score={score}
          passed={passed}
          levelId={level.id}
          nextLevelId={nextLevelId}
        />
      </div>
    );
  }

  // in_progress
  const progressPercent =
    questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <ProgressBar value={progressPercent} color="blue" />
      {currentQuestion && (
        <TestQuestionComponent
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onSubmit={submitAnswer}
        />
      )}
    </div>
  );
}
