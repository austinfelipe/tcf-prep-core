'use client';

import { useState } from 'react';
import { WritingTaskDefinition } from '@/types/writing';
import { Badge } from '@/components/ui/Badge';

interface TaskInstructionsProps {
  task: WritingTaskDefinition;
  prompt: string;
}

export function TaskInstructions({ task, prompt }: TaskInstructionsProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 font-medium text-gray-900">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Consigne
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 px-4 py-3 space-y-3">
          <p className="text-sm leading-relaxed text-gray-700">{prompt}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="info">{task.cefrRange}</Badge>
            <Badge variant="default">
              {task.minWords}–{task.maxWords} mots
            </Badge>
            <Badge variant="default">
              {task.register === 'informal' ? 'Informel' : task.register === 'semi-formal' ? 'Semi-formel' : 'Formel'}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
