'use client';

import { AdverbComboType } from '@/types/adverb';

interface AdverbPromptProps {
  masculine: string;
  english: string;
  combo: AdverbComboType;
}

export function AdverbPrompt({ masculine, english, combo }: AdverbPromptProps) {
  const isFeminin = combo === 'féminin';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${
          isFeminin
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}
      >
        {isFeminin ? 'Féminin' : 'Adverbe'}
      </span>
      <p className="text-2xl font-bold text-gray-900">{masculine}</p>
      <p className="mt-1 text-sm text-gray-500">{english}</p>
    </div>
  );
}
