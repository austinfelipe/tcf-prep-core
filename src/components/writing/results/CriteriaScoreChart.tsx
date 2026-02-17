'use client';

import { CriterionResult } from '@/types/writing';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface CriteriaScoreChartProps {
  criteria: CriterionResult[];
}

function getColor(score: number): 'green' | 'blue' | 'amber' {
  if (score >= 3) return 'green';
  if (score >= 2) return 'blue';
  return 'amber';
}

export function CriteriaScoreChart({ criteria }: CriteriaScoreChartProps) {
  return (
    <div className="space-y-3">
      {criteria.map((c) => (
        <div key={c.name}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{c.name}</span>
            <span className="font-bold text-gray-900">{c.score}/4</span>
          </div>
          <ProgressBar value={(c.score / 4) * 100} color={getColor(c.score)} />
          {c.comment && (
            <p className="mt-0.5 text-xs text-gray-500">{c.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
