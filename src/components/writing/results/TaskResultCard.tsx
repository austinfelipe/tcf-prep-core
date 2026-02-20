'use client';

import { useState } from 'react';
import { TaskEvaluation } from '@/types/writing';
import { WRITING_TASKS } from '@/data/writingTasks';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CriteriaScoreChart } from './CriteriaScoreChart';
import { GrammarAnalysisSection } from './GrammarAnalysisSection';
import { ImprovedVersionModal } from './ImprovedVersionModal';

interface TaskResultCardProps {
  evaluation: TaskEvaluation;
  originalText?: string;
  originalPrompt?: string;
}

export function TaskResultCard({ evaluation, originalText, originalPrompt }: TaskResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showImprovedModal, setShowImprovedModal] = useState(false);
  const taskDef = WRITING_TASKS.find((t) => t.id === evaluation.taskId);

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
              {evaluation.taskId}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {taskDef?.title ?? `Tâche ${evaluation.taskId}`}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{evaluation.cefrLevel}</Badge>
            <span className="text-xl font-bold text-gray-900">
              {evaluation.score}/20
            </span>
          </div>
        </div>

        {/* Criteria chart */}
        <CriteriaScoreChart criteria={evaluation.criteria} />

        {/* Strengths / Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          {evaluation.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-green-700 mb-1">Points forts</h4>
              <ul className="space-y-1">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                    <span className="text-green-500 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {evaluation.weaknesses.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-red-700 mb-1">Points faibles</h4>
              <ul className="space-y-1">
                {evaluation.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                    <span className="text-red-500 shrink-0">&minus;</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Improved version button */}
        {originalText && originalPrompt && (
          <Button
            variant="secondary"
            onClick={() => setShowImprovedModal(true)}
          >
            Voir la version améliorée
          </Button>
        )}

        {/* Expandable details */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {expanded ? 'Masquer les détails' : 'Voir les détails'}
        </button>

        {expanded && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <GrammarAnalysisSection notes={evaluation.grammarNotes} />

            {evaluation.coherenceAnalysis && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Analyse de la cohérence
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {evaluation.coherenceAnalysis}
                </p>
              </div>
            )}

            {evaluation.lexicalAnalysis && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Analyse lexicale
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {evaluation.lexicalAnalysis}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showImprovedModal && originalText && originalPrompt && (
        <ImprovedVersionModal
          taskId={evaluation.taskId}
          originalText={originalText}
          originalPrompt={originalPrompt}
          cefrLevel={evaluation.cefrLevel}
          grammarNotes={evaluation.grammarNotes}
          onClose={() => setShowImprovedModal(false)}
        />
      )}
    </Card>
  );
}
