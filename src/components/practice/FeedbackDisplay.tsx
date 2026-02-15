'use client';

import { ValidationResult } from '@/lib/validation';

interface FeedbackDisplayProps {
  result: ValidationResult;
  userAnswer: string;
}

export function FeedbackDisplay({ result, userAnswer }: FeedbackDisplayProps) {
  if (result.correct) {
    return (
      <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-lg font-semibold text-green-800">Correct!</span>
        </div>
        <p className="mt-1 text-green-700">{result.expected}</p>
      </div>
    );
  }

  if (result.accentError) {
    return (
      <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg font-semibold text-amber-800">Almost! Check your accents</span>
        </div>
        <p className="mt-2 text-amber-700">
          Your answer: <span className="line-through">{userAnswer}</span>
        </p>
        <p className="text-amber-900 font-semibold">
          Correct: {result.expected}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-lg font-semibold text-red-800">Incorrect</span>
      </div>
      <p className="mt-2 text-red-700">
        Your answer: <span className="line-through">{userAnswer}</span>
      </p>
      <p className="text-red-900 font-semibold">
        Correct: {result.expected}
      </p>
    </div>
  );
}
