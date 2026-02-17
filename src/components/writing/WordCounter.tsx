'use client';

import { useWordCount } from '@/hooks/useWordCount';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface WordCounterProps {
  text: string;
  minWords: number;
  maxWords: number;
}

export function WordCounter({ text, minWords, maxWords }: WordCounterProps) {
  const { count, status } = useWordCount(text, minWords, maxWords);

  const percentage = Math.min(100, (count / maxWords) * 100);
  const color = status === 'under' ? 'amber' : status === 'over' ? 'amber' : 'green';

  const statusLabel =
    status === 'under'
      ? `${minWords - count} mots restants`
      : status === 'over'
        ? `${count - maxWords} mots en trop`
        : 'Dans la limite';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {count} / {minWords}–{maxWords} mots
        </span>
        <span
          className={`text-xs font-medium ${
            status === 'in-range'
              ? 'text-green-600'
              : 'text-amber-600'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <ProgressBar value={percentage} color={color} />
    </div>
  );
}
