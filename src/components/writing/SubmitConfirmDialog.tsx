'use client';

import { WritingTaskId, WritingTaskState } from '@/types/writing';
import { WRITING_TASKS } from '@/data/writingTasks';
import { countWords } from '@/lib/wordCount';
import { Button } from '@/components/ui/Button';

interface SubmitConfirmDialogProps {
  tasks: Record<WritingTaskId, WritingTaskState>;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitConfirmDialog({ tasks, onConfirm, onCancel }: SubmitConfirmDialogProps) {
  const warnings: string[] = [];

  for (const def of WRITING_TASKS) {
    const task = tasks[def.id];
    const wc = countWords(task.text);
    if (wc === 0) {
      warnings.push(`Tâche ${def.id} : aucun texte`);
    } else if (wc < def.minWords) {
      warnings.push(`Tâche ${def.id} : ${wc} mots (minimum ${def.minWords})`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">
          Soumettre pour évaluation ?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Vos textes seront envoyés pour une évaluation par IA selon les critères du TCF.
          Cette action est définitive pour cette session.
        </p>

        {warnings.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-800">Attention :</p>
            <ul className="mt-1 space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className="text-sm text-amber-700">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {WRITING_TASKS.map((def) => {
            const wc = countWords(tasks[def.id].text);
            return (
              <div key={def.id} className="flex justify-between text-sm text-gray-600">
                <span>Tâche {def.id} – {def.title}</span>
                <span className="font-medium">{wc} mots</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Soumettre
          </Button>
        </div>
      </div>
    </div>
  );
}
