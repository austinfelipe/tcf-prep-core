'use client';

import { WritingTaskId, WritingTaskState } from '@/types/writing';
import { WRITING_TASKS } from '@/data/writingTasks';

interface TaskTabBarProps {
  activeTaskId: WritingTaskId;
  tasks: Record<WritingTaskId, WritingTaskState>;
  onTabChange: (taskId: WritingTaskId) => void;
}

function getStatusIndicator(task: WritingTaskState): { color: string; label: string } {
  if (task.timeExpired) return { color: 'bg-red-400', label: 'Complete' };
  if (task.text.length > 0) return { color: 'bg-blue-400', label: 'In progress' };
  return { color: 'bg-gray-300', label: 'Not started' };
}

export function TaskTabBar({ activeTaskId, tasks, onTabChange }: TaskTabBarProps) {
  return (
    <div className="flex border-b border-gray-200">
      {WRITING_TASKS.map((def) => {
        const task = tasks[def.id];
        const isActive = def.id === activeTaskId;
        const status = getStatusIndicator(task);

        return (
          <button
            key={def.id}
            type="button"
            onClick={() => onTabChange(def.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${status.color}`} title={status.label} />
            Task {def.id}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
