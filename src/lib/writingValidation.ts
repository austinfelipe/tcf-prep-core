import { EvaluateWritingRequest, WritingTaskId } from '@/types/writing';

const VALID_TASK_IDS: WritingTaskId[] = [1, 2, 3];
const MAX_TEXT_LENGTH = 5000;

export interface ValidationError {
  error: string;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

export function validateEvaluationRequest(
  body: unknown
): { valid: true; data: EvaluateWritingRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const obj = body as Record<string, unknown>;

  if (!Array.isArray(obj.tasks)) {
    return { valid: false, error: 'Missing tasks array' };
  }

  if (obj.tasks.length !== 3) {
    return { valid: false, error: 'Exactly 3 tasks required' };
  }

  const seenIds = new Set<number>();
  const sanitizedTasks: EvaluateWritingRequest['tasks'] = [];

  for (const task of obj.tasks) {
    if (!task || typeof task !== 'object') {
      return { valid: false, error: 'Invalid task entry' };
    }

    const t = task as Record<string, unknown>;

    if (typeof t.taskId !== 'number' || !VALID_TASK_IDS.includes(t.taskId as WritingTaskId)) {
      return { valid: false, error: `Invalid taskId: ${t.taskId}` };
    }

    if (seenIds.has(t.taskId as number)) {
      return { valid: false, error: `Duplicate taskId: ${t.taskId}` };
    }
    seenIds.add(t.taskId as number);

    if (typeof t.prompt !== 'string' || !t.prompt.trim()) {
      return { valid: false, error: `Missing prompt for task ${t.taskId}` };
    }

    if (typeof t.text !== 'string') {
      return { valid: false, error: `Missing text for task ${t.taskId}` };
    }

    const cleanText = stripHtml(t.text as string);
    if (cleanText.length > MAX_TEXT_LENGTH) {
      return {
        valid: false,
        error: `Task ${t.taskId} text exceeds ${MAX_TEXT_LENGTH} characters`,
      };
    }

    sanitizedTasks.push({
      taskId: t.taskId as WritingTaskId,
      prompt: (t.prompt as string).trim(),
      text: cleanText,
    });
  }

  return { valid: true, data: { tasks: sanitizedTasks } };
}
