import { UserProgress, LevelProgress, PROGRESS_VERSION, STORAGE_KEY } from '@/types/progress';
import { LevelId } from '@/types/level';

function createDefaultLevelProgress(unlocked: boolean): LevelProgress {
  return {
    unlocked,
    verbMastery: {},
    testAttempts: [],
    testPassed: false,
  };
}

export function createDefaultProgress(): UserProgress {
  return {
    version: PROGRESS_VERSION,
    levels: {
      a1: createDefaultLevelProgress(true),
      a2: createDefaultLevelProgress(false),
      b1: createDefaultLevelProgress(false),
      b2: createDefaultLevelProgress(false),
    },
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.version !== PROGRESS_VERSION) {
      return createDefaultProgress();
    }
    return parsed;
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress to localStorage');
  }
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function updateVerbCombo(
  progress: UserProgress,
  levelId: LevelId,
  verbId: string,
  comboKey: string,
  correct: boolean
): UserProgress {
  const updated = structuredClone(progress);
  const level = updated.levels[levelId];

  if (!level.verbMastery[verbId]) {
    level.verbMastery[verbId] = {};
  }

  const combo = level.verbMastery[verbId][comboKey] ?? {
    correctCount: 0,
    totalAttempts: 0,
    lastPracticed: 0,
  };

  combo.totalAttempts += 1;
  if (correct) {
    combo.correctCount += 1;
    combo.lastPracticed = Date.now();
  }

  level.verbMastery[verbId][comboKey] = combo;
  return updated;
}

export function unlockLevel(progress: UserProgress, levelId: LevelId): UserProgress {
  const updated = structuredClone(progress);
  updated.levels[levelId].unlocked = true;
  return updated;
}

export function exportProgress(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ?? JSON.stringify(createDefaultProgress());
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tcf-prep-progress.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const LEVEL_KEYS: LevelId[] = ['a1', 'a2', 'b1', 'b2'];

export async function parseProgressFile(file: File): Promise<UserProgress> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('File does not contain a valid progress object.');
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.version !== PROGRESS_VERSION) {
    throw new Error(`Unsupported progress version. Expected ${PROGRESS_VERSION}.`);
  }

  if (typeof obj.levels !== 'object' || obj.levels === null) {
    throw new Error('Missing levels data.');
  }

  const levels = obj.levels as Record<string, unknown>;
  for (const key of LEVEL_KEYS) {
    if (typeof levels[key] !== 'object' || levels[key] === null) {
      throw new Error(`Missing level "${key}".`);
    }
    const level = levels[key] as Record<string, unknown>;
    if (typeof level.unlocked !== 'boolean') {
      throw new Error(`Level "${key}" missing "unlocked".`);
    }
    if (typeof level.verbMastery !== 'object' || level.verbMastery === null) {
      throw new Error(`Level "${key}" missing "verbMastery".`);
    }
    if (!Array.isArray(level.testAttempts)) {
      throw new Error(`Level "${key}" missing "testAttempts".`);
    }
    if (typeof level.testPassed !== 'boolean') {
      throw new Error(`Level "${key}" missing "testPassed".`);
    }
  }

  return parsed as UserProgress;
}
