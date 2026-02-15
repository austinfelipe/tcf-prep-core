'use client';

import { TestQuestion as TestQuestionType } from '@/lib/testGenerator';
import { TENSE_DISPLAY_NAMES, Tense } from '@/types/conjugation';
import { PRONOUN_DISPLAY } from '@/data/pronouns';
import type { Pronoun } from '@/types/conjugation';
import { Badge } from '@/components/ui/Badge';
import { AnswerInput } from '@/components/practice/AnswerInput';

interface TestQuestionProps {
  question: TestQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string) => void;
}

export function TestQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
}: TestQuestionProps) {
  const pronounDisplay = PRONOUN_DISPLAY[question.pronoun as Pronoun] ?? question.pronoun;
  const tenseDisplay = TENSE_DISPLAY_NAMES[question.tense as Tense];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <Badge variant="info">{tenseDisplay}</Badge>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{question.infinitive}</h2>
        <div className="mt-3 text-xl text-gray-700">
          <span className="font-medium">{pronounDisplay}</span>
          {question.tense !== 'impératif' && (
            <span className="ml-2 text-gray-400">...</span>
          )}
        </div>
      </div>

      <AnswerInput onSubmit={onSubmit} />
    </div>
  );
}
