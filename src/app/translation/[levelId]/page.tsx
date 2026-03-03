'use client';

import { use } from 'react';
import { getTranslationLevelById, getPhrasesForLevel } from '@/data/translations';
import { Header } from '@/components/layout/Header';
import { TranslationSession } from '@/components/translation/TranslationSession';
import { notFound } from 'next/navigation';

export default function TranslationPracticePage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = use(params);
  const level = getTranslationLevelById(levelId);

  if (!level) return notFound();

  const phrases = getPhrasesForLevel(level.id);

  return (
    <div className="min-h-screen">
      <Header
        title={`Translation ${level.label}`}
        backHref="/translation"
        backLabel="Translation"
      />
      <TranslationSession phrases={phrases} levelId={level.id} />
    </div>
  );
}
