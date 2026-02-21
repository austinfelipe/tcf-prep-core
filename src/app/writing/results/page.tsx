'use client';

import { Header } from '@/components/layout/Header';
import { WritingResults } from '@/components/writing/results/WritingResults';

export default function WritingResultsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Results" backHref="/writing" backLabel="Written Expression" />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <WritingResults />
      </main>
    </div>
  );
}
