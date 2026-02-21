'use client';

import { Header } from '@/components/layout/Header';
import { WritingSession } from '@/components/writing/WritingSession';

export default function WritingSessionPage() {
  return (
    <div className="min-h-screen">
      <Header title="Written Expression" backHref="/writing" backLabel="Back" />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <WritingSession />
      </main>
    </div>
  );
}
