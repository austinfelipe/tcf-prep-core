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
  if (correct) combo.correctCount += 1;
  combo.lastPracticed = Date.now();

  level.verbMastery[verbId][comboKey] = combo;
  return updated;
}

export function unlockLevel(progress: UserProgress, levelId: LevelId): UserProgress {
  const updated = structuredClone(progress);
  updated.levels[levelId].unlocked = true;
  return updated;
}
