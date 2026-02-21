'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WRITING_TASKS } from '@/data/writingTasks';
import { loadSession, loadEvaluationHistory, createNewSession, saveSession, clearSession } from '@/lib/writingStorage';
import { StoredEvaluationData } from '@/types/writing';
import { WritingTaskCard } from './WritingTaskCard';
import { SessionImprovementsModal } from './SessionImprovementsModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';

export function WritingLanding() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [history, setHistory] = useState<StoredEvaluationData[]>([]);
  const [activeImprovementIndex, setActiveImprovementIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setHasSession(!!session);

    const evalHistory = loadEvaluationHistory();
    setHistory(evalHistory);
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
        <Header title="Written Expression" backHref="/" backLabel="Home" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Written Expression" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Written Expression — TCF
          </h2>
          <p className="mt-2 text-gray-500">
            Simulate the TCF written expression exam: 3 tasks with different registers
            and word limits, followed by AI evaluation.
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
            New session
          </Button>
          {hasSession && (
            <Button
              onClick={handleResume}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Resume current session
            </Button>
          )}
        </div>

        {/* Past results */}
        {history.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              Previous results
            </h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((entry, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{entry.result.overallCefrLevel}</Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(entry.result.evaluatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {entry.originalTexts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveImprovementIndex(i)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          See improvements
                        </button>
                      )}
                      <span className="text-lg font-bold text-gray-900">
                        {entry.result.overallScore.toFixed(1)}/20
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeImprovementIndex !== null && history[activeImprovementIndex] && (
          <SessionImprovementsModal
            entry={history[activeImprovementIndex]}
            onClose={() => setActiveImprovementIndex(null)}
          />
        )}
      </main>
    </div>
  );
}
