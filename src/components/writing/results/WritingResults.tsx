'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  WritingEvaluationResult,
  EvaluateWritingResponse,
  EvaluateWritingError,
} from '@/types/writing';
import {
  saveEvaluationResult,
  loadLatestEvaluation,
  clearSession,
} from '@/lib/writingStorage';
import { EvaluationLoading } from './EvaluationLoading';
import { OverallScoreBanner } from './OverallScoreBanner';
import { TaskResultCard } from './TaskResultCard';
import { Button } from '@/components/ui/Button';

export function WritingResults() {
  const router = useRouter();
  const [result, setResult] = useState<WritingEvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function evaluate() {
      // Check if we have pending evaluation data
      const pendingRaw = localStorage.getItem('tcf-writing-pending-evaluation');

      if (!pendingRaw) {
        // No pending evaluation — try to show the latest result
        const latest = loadLatestEvaluation();
        if (latest) {
          setResult(latest);
          setLoading(false);
          return;
        }
        // Nothing to show
        router.push('/writing');
        return;
      }

      // Parse pending data and call API
      try {
        const pending = JSON.parse(pendingRaw);
        localStorage.removeItem('tcf-writing-pending-evaluation');

        const response = await fetch('/api/evaluate-writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending),
        });

        const data: EvaluateWritingResponse | EvaluateWritingError =
          await response.json();

        if (!response.ok || !data.success) {
          setError(
            (data as EvaluateWritingError).error ??
              "Erreur lors de l'évaluation"
          );
          setLoading(false);
          return;
        }

        const evalResult = (data as EvaluateWritingResponse).result;
        saveEvaluationResult(evalResult);
        clearSession();
        setResult(evalResult);
      } catch {
        setError("Erreur réseau. Veuillez vérifier votre connexion et réessayer.");
      }
      setLoading(false);
    }

    evaluate();
  }, [router]);

  if (loading) return <EvaluationLoading />;

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center max-w-md">
          <h3 className="text-lg font-bold text-red-800">Erreur</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/writing')}>
          Retour
        </Button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6">
      <OverallScoreBanner
        cefrLevel={result.overallCefrLevel}
        score={result.overallScore}
      />

      <div className="space-y-4">
        {result.tasks.map((taskEval) => (
          <TaskResultCard key={taskEval.taskId} evaluation={taskEval} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => router.push('/writing')}
          className="flex-1"
        >
          Retour
        </Button>
        <Button
          onClick={() => {
            clearSession();
            router.push('/writing');
          }}
          className="flex-1"
        >
          Nouvelle session
        </Button>
      </div>
    </div>
  );
}
