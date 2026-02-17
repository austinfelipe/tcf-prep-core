'use client';

import { WritingTaskDefinition } from '@/types/writing';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface WritingTaskCardProps {
  task: WritingTaskDefinition;
}

export function WritingTaskCard({ task }: WritingTaskCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
          {task.id}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{task.title}</h3>
            <Badge variant="info">{task.cefrRange}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {task.minWords}–{task.maxWords} mots · {task.timeLimitSeconds / 60} minutes · Registre {task.register === 'informal' ? 'informel' : task.register === 'semi-formal' ? 'semi-formel' : 'formel'}
          </p>
        </div>
      </div>
    </Card>
  );
}
