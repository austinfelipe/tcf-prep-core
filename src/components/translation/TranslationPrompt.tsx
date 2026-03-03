'use client';

import { Badge } from '@/components/ui/Badge';

interface TranslationPromptProps {
  english: string;
}

export function TranslationPrompt({ english }: TranslationPromptProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <Badge variant="info" className="mb-3">Translate to French</Badge>
      <p className="text-xl font-medium text-gray-900">{english}</p>
    </div>
  );
}
