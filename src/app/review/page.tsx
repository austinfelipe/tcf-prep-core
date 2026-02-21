'use client';

import { Header } from '@/components/layout/Header';
import { ReviewSession } from '@/components/review/ReviewSession';

export default function ReviewPage() {
  return (
    <div className="min-h-screen">
      <Header title="Review" backHref="/conjugation" backLabel="Conjugation" />
      <ReviewSession />
    </div>
  );
}
