'use client';

import { Tense, TENSE_DISPLAY_NAMES } from '@/types/conjugation';
import { PRONOUN_DISPLAY } from '@/data/pronouns';
import type { Pronoun } from '@/types/conjugation';
import { Badge } from '@/components/ui/Badge';

interface ConjugationPromptProps {
  infinitive: string;
  translation: string;
  tense: Tense;
  pronoun: string;
}

export function ConjugationPrompt({
  infinitive,
  translation,
  tense,
  pronoun,
}: ConjugationPromptProps) {
  const pronounDisplay = PRONOUN_DISPLAY[pronoun as Pronoun] ?? pronoun;
  const tenseDisplay = TENSE_DISPLAY_NAMES[tense];

  return (
    <div className="text-center">
      <div className="mb-2">
        <Badge variant="info">{tenseDisplay}</Badge>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">{infinitive}</h2>
      <p className="mt-1 text-sm text-gray-500">{translation}</p>
      <div className="mt-4 text-xl text-gray-700">
        <span className="font-medium">{pronounDisplay}</span>
        {tense !== 'impératif' && <span className="ml-2 text-gray-400">...</span>}
      </div>
    </div>
  );
}
