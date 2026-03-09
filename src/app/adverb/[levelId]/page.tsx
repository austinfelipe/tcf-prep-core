'use client';

import { use } from 'react';
import { getAdverbLevelById, getAdjectivesForLevel } from '@/data/adverbs';
import { Header } from '@/components/layout/Header';
import { AdverbSession } from '@/components/adverb/AdverbSession';
import { notFound } from 'next/navigation';

export default function AdverbPracticePage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = use(params);
  const level = getAdverbLevelById(levelId);

  if (!level) return notFound();

  const adjectives = getAdjectivesForLevel(level.id);

  return (
    <div className="min-h-screen">
      <Header
        title={`Adjectives ${level.label}`}
        backHref="/adverb"
        backLabel="Adjectives"
      />
      <AdverbSession adjectives={adjectives} levelId={level.id} />
    </div>
  );
}
