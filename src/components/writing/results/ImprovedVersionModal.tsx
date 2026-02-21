'use client';

import { useState, useEffect } from 'react';
import { WritingTaskId, GrammarNote, ImproveWritingResponse, ImproveWritingError } from '@/types/writing';
import { DiffView } from './DiffView';
import { Button } from '@/components/ui/Button';

interface ImprovedVersionModalProps {
  taskId: WritingTaskId;
  originalText: string;
  originalPrompt: string;
  cefrLevel: string;
  grammarNotes: GrammarNote[];
  onClose: () => void;
}

export function ImprovedVersionModal({
  taskId,
  originalText,
  originalPrompt,
  cefrLevel,
  grammarNotes,
  onClose,
}: ImprovedVersionModalProps) {
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImproved() {
      try {
        const response = await fetch('/api/improve-writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId,
            prompt: originalPrompt,
            text: originalText,
            cefrLevel,
            grammarNotes,
          }),
        });

        const data: ImproveWritingResponse | ImproveWritingError =
          await response.json();

        if (!response.ok || !data.success) {
          setError((data as ImproveWritingError).error ?? "Improvement error");
          return;
        }

        setImprovedText((data as ImproveWritingResponse).improvedText);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchImproved();
  }, [taskId, originalPrompt, originalText, cefrLevel, grammarNotes]);

  function handleRetry() {
    setError(null);
    setLoading(true);
    setImprovedText(null);
    // Re-trigger by forcing a state change — the useEffect deps won't re-fire
    // so we manually re-fetch
    (async () => {
      try {
        const response = await fetch('/api/improve-writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId,
            prompt: originalPrompt,
            text: originalText,
            cefrLevel,
            grammarNotes,
          }),
        });

        const data: ImproveWritingResponse | ImproveWritingError =
          await response.json();

        if (!response.ok || !data.success) {
          setError((data as ImproveWritingError).error ?? "Improvement error");
          return;
        }

        setImprovedText((data as ImproveWritingResponse).improvedText);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Improved version — Task {taskId}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">
              Generating improved version...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button variant="secondary" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}

        {improvedText && (
          <DiffView original={originalText} improved={improvedText} />
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
