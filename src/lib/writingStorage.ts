import { WritingSessionState, WritingEvaluationResult, WritingTaskId } from '@/types/writing';
import { WRITING_TASKS } from '@/data/writingTasks';

const SESSION_KEY = 'tcf-writing-session';
const HISTORY_KEY = 'tcf-writing-history';

// --- Session ---

export function createNewSession(): WritingSessionState {
  const id = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const tasks = {} as WritingSessionState['tasks'];
  for (const task of WRITING_TASKS) {
    const promptIndex = Math.floor(Math.random() * task.prompts.length);
    tasks[task.id as WritingTaskId] = {
      taskId: task.id,
      promptIndex,
      text: '',
      timerStarted: false,
      timerRemainingMs: task.timeLimitSeconds * 1000,
      timerLastTick: null,
      timeExpired: false,
    };
  }

  return {
    id,
    createdAt: Date.now(),
    activeTaskId: 1,
    tasks,
  };
}

export function saveSession(session: WritingSessionState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable
  }
}

export function loadSession(): WritingSessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WritingSessionState;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// --- Evaluation History ---

export function saveEvaluationResult(result: WritingEvaluationResult): void {
  try {
    const history = loadEvaluationHistory();
    history.unshift(result);
    // Keep last 20 results
    const trimmed = history.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full
  }
}

export function loadEvaluationHistory(): WritingEvaluationResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WritingEvaluationResult[];
  } catch {
    return [];
  }
}

export function loadLatestEvaluation(): WritingEvaluationResult | null {
  const history = loadEvaluationHistory();
  return history[0] ?? null;
}
