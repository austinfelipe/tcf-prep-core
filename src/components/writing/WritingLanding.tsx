'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WRITING_TASKS } from '@/data/writingTasks';
import { loadSession, loadEvaluationHistory, createNewSession, saveSession, clearSession } from '@/lib/writingStorage';
import { WritingTaskCard } from './WritingTaskCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';

export function WritingLanding() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [history, setHistory] = useState<{ cefrLevel: string; score: number; date: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setHasSession(!!session);

    const evalHistory = loadEvaluationHistory();
    setHistory(
      evalHistory.map((entry) => ({
        cefrLevel: entry.result.overallCefrLevel,
        score: entry.result.overallScore,
        date: entry.result.evaluatedAt,
      }))
    );
    setIsLoaded(true);
  }, []);

  const handleStartNew = () => {
    clearSession();
    const session = createNewSession();
    saveSession(session);
    router.push('/writing/session');
  };

  const handleResume = () => {
    router.push('/writing/session');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <Header title="Expression Ecrite" backHref="/" backLabel="Accueil" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Expression Ecrite" backHref="/" backLabel="Accueil" />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Expression Ecrite — TCF
          </h2>
          <p className="mt-2 text-gray-500">
            Simulez l&apos;épreuve d&apos;expression écrite du TCF : 3 tâches avec des registres
            et limites de mots différents, suivies d&apos;une évaluation par IA.
          </p>
        </div>

        {/* Task overview cards */}
        <div className="space-y-3 mb-8">
          {WRITING_TASKS.map((task) => (
            <WritingTaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Start / Resume buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <Button onClick={handleStartNew} size="lg" className="w-full">
            Nouvelle session
          </Button>
          {hasSession && (
            <Button
              onClick={handleResume}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Reprendre la session en cours
            </Button>
          )}
        </div>

        {/* Past results */}
        {history.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              Résultats précédents
            </h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((result, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{result.cefrLevel}</Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(result.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {result.score.toFixed(1)}/20
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
