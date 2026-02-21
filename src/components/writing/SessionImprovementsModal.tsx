'use client';

import { useState, useEffect } from 'react';
import {
  StoredEvaluationData,
  WritingTaskId,
  WritingImprovementRecord,
  FetchImprovementsResponse,
  ImprovementErrorResponse,
} from '@/types/writing';
import { TaskImprovementPanel } from './TaskImprovementPanel';
import { Button } from '@/components/ui/Button';

interface SessionImprovementsModalProps {
  entry: StoredEvaluationData;
  onClose: () => void;
}

const TASK_IDS: WritingTaskId[] = [1, 2, 3];

export function SessionImprovementsModal({ entry, onClose }: SessionImprovementsModalProps) {
  const [activeTab, setActiveTab] = useState<WritingTaskId>(1);
  const [cached, setCached] = useState<Record<number, WritingImprovementRecord>>({});
  const [fetchLoading, setFetchLoading] = useState(true);

  const sessionId = entry.result.sessionId;

  useEffect(() => {
    async function fetchCached() {
      try {
        const response = await fetch(
          `/api/writing-improvements?sessionId=${encodeURIComponent(sessionId)}`
        );
        const data: FetchImprovementsResponse | ImprovementErrorResponse =
          await response.json();

        if (response.ok && data.success) {
          const map: Record<number, WritingImprovementRecord> = {};
          for (const imp of (data as FetchImprovementsResponse).improvements) {
            map[imp.taskId] = imp;
          }
          setCached(map);
        }
      } catch {
        // Silently fail — panels will show generate buttons
      } finally {
        setFetchLoading(false);
      }
    }

    fetchCached();
  }, [sessionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">AI Improvements</h3>
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

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          {TASK_IDS.map((id) => {
            const hasText = entry.originalTexts.some((t) => t.taskId === id);
            return (
              <button
                key={id}
                type="button"
                disabled={!hasText}
                onClick={() => setActiveTab(id)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : hasText
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'cursor-not-allowed text-gray-300'
                }`}
              >
                Task {id}
              </button>
            );
          })}
        </div>

        {/* Panel content */}
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">Loading improvements...</p>
          </div>
        ) : (
          (() => {
            const originalTask = entry.originalTexts.find((t) => t.taskId === activeTab);
            if (!originalTask) {
              return (
                <div className="py-8 text-center text-sm text-gray-400">
                  No text available for this task.
                </div>
              );
            }

            const taskEval = entry.result.tasks.find((t) => t.taskId === activeTab);
            const cefrLevel = taskEval?.cefrLevel ?? entry.result.overallCefrLevel;
            const grammarNotes = taskEval?.grammarNotes ?? [];

            return (
              <TaskImprovementPanel
                key={`${sessionId}-${activeTab}`}
                sessionId={sessionId}
                taskId={activeTab}
                originalText={originalTask.text}
                prompt={originalTask.prompt}
                cefrLevel={cefrLevel}
                grammarNotes={grammarNotes}
                cachedImprovement={cached[activeTab] ?? null}
              />
            );
          })()
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
