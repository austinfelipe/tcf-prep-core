'use client';

import { use } from 'react';
import { getLevelById } from '@/data/levels';
import { getVerbById } from '@/data/conjugations';
import { Header } from '@/components/layout/Header';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { notFound } from 'next/navigation';

export default function PracticePage({
  params,
}: {
  params: Promise<{ levelId: string; verbId: string }>;
}) {
  const { levelId, verbId } = use(params);
  const level = getLevelById(levelId);
  const verb = getVerbById(verbId);

  if (!level || !verb) return notFound();

  return (
    <div className="min-h-screen">
      <Header
        title={verb.infinitive}
        backHref={`/level/${levelId}`}
        backLabel={level.label}
      />
      <PracticeSession verb={verb} tenses={level.tenses} levelId={level.id} />
    </div>
  );
}
