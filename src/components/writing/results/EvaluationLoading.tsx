'use client';

import { useState, useEffect } from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';

const STEPS = [
  'Envoi de vos réponses...',
  'Analyse de la tâche 1...',
  'Analyse de la tâche 2...',
  'Analyse de la tâche 3...',
  'Calcul du score final...',
];

const STEP_DURATION_MS = 3000;

export function EvaluationLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">
            Évaluation en cours...
          </h3>
          <p className="mt-1 text-sm font-medium text-blue-600">
            {STEPS[currentStep]}
          </p>
        </div>

        <ProgressBar value={progress} />

        <ul className="space-y-1.5">
          {STEPS.map((label, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              {i < currentStep ? (
                <span className="text-green-500">&#10003;</span>
              ) : i === currentStep ? (
                <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-blue-500" />
              ) : (
                <span className="h-3 w-3 shrink-0 rounded-full bg-gray-200" />
              )}
              <span
                className={
                  i < currentStep
                    ? 'text-gray-400 line-through'
                    : i === currentStep
                      ? 'font-medium text-gray-900'
                      : 'text-gray-400'
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
