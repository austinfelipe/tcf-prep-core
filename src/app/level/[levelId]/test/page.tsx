'use client';

import { use } from 'react';
import { getLevelById, LEVELS } from '@/data/levels';
import { getVerbsByIds } from '@/data/conjugations';
import { Header } from '@/components/layout/Header';
import { TestSession } from '@/components/test/TestSession';
import { notFound } from 'next/navigation';

export default function TestPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = use(params);
  const level = getLevelById(levelId);

  if (!level) return notFound();

  const verbs = getVerbsByIds(level.verbIds);
  const levelOrder = LEVELS.map((l) => l.id);
  const currentIdx = levelOrder.indexOf(level.id);
  const nextLevelId = currentIdx < levelOrder.length - 1 ? levelOrder[currentIdx + 1] : null;

  return (
    <div className="min-h-screen">
      <Header
        title={`${level.label} Test`}
        backHref={`/level/${levelId}`}
        backLabel={level.label}
      />
      <TestSession level={level} verbs={verbs} nextLevelId={nextLevelId} />
    </div>
  );
}
