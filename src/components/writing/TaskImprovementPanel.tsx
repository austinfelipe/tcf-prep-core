'use client';

import { useState } from 'react';
import {
  WritingTaskId,
  GrammarNote,
  WritingImprovementRecord,
  GenerateImprovementResponse,
  ImprovementErrorResponse,
} from '@/types/writing';
import { DiffView } from '@/components/writing/results/DiffView';
import { Button } from '@/components/ui/Button';

interface TaskImprovementPanelProps {
  sessionId: string;
  taskId: WritingTaskId;
  originalText: string;
  prompt: string;
  cefrLevel: string;
  grammarNotes: GrammarNote[];
  cachedImprovement: WritingImprovementRecord | null;
}

export function TaskImprovementPanel({
  sessionId,
  taskId,
  originalText,
  prompt,
  cefrLevel,
  grammarNotes,
  cachedImprovement,
}: TaskImprovementPanelProps) {
  const [improvement, setImprovement] = useState<WritingImprovementRecord | null>(cachedImprovement);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/writing-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          taskId,
          prompt,
          text: originalText,
          cefrLevel,
          grammarNotes,
        }),
      });

      const data: GenerateImprovementResponse | ImprovementErrorResponse =
        await response.json();

      if (!response.ok || !data.success) {
        setError((data as ImprovementErrorResponse).error ?? 'Improvement error');
        return;
      }

      setImprovement((data as GenerateImprovementResponse).improvement);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (improvement) {
    return <DiffView original={improvement.originalText} improved={improvement.improvedText} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-500">Generating improved version...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <Button variant="secondary" onClick={handleGenerate}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <p className="text-sm text-gray-500">
        Generate an AI-improved version of your text to see what could be better.
      </p>
      <Button onClick={handleGenerate}>Generate improved version</Button>
    </div>
  );
}
