import {
  AdverbProgress,
  AdverbLevelProgress,
  AdverbLevelId,
  AdverbComboType,
  ADVERB_PROGRESS_VERSION,
  ADVERB_STORAGE_KEY,
} from '@/types/adverb';

function createDefaultLevelProgress(unlocked: boolean): AdverbLevelProgress {
  return {
    unlocked,
    adjectiveMastery: {},
  };
}

export function createDefaultAdverbProgress(): AdverbProgress {
  return {
    version: ADVERB_PROGRESS_VERSION,
    levels: {
      a1: createDefaultLevelProgress(true),
      a2: createDefaultLevelProgress(false),
      b1: createDefaultLevelProgress(false),
      b2: createDefaultLevelProgress(false),
    },
  };
}

export function loadAdverbProgress(): AdverbProgress {
  if (typeof window === 'undefined') return createDefaultAdverbProgress();

  try {
    const raw = localStorage.getItem(ADVERB_STORAGE_KEY);
    if (!raw) return createDefaultAdverbProgress();
    const parsed = JSON.parse(raw) as AdverbProgress;
    if (parsed.version !== ADVERB_PROGRESS_VERSION) {
      return createDefaultAdverbProgress();
    }
    return parsed;
  } catch {
    return createDefaultAdverbProgress();
  }
}

export function saveAdverbProgress(progress: AdverbProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADVERB_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save adverb progress to localStorage');
  }
}

export function resetAdverbProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADVERB_STORAGE_KEY);
}

export function updateAdverbComboMastery(
  progress: AdverbProgress,
  levelId: AdverbLevelId,
  adjectiveId: string,
  comboKey: AdverbComboType,
  correct: boolean,
): AdverbProgress {
  const updated = structuredClone(progress);
  const level = updated.levels[levelId];

  if (!level.adjectiveMastery[adjectiveId]) {
    level.adjectiveMastery[adjectiveId] = {};
  }

  const mastery = level.adjectiveMastery[adjectiveId][comboKey] ?? {
    correctCount: 0,
    totalAttempts: 0,
    lastPracticed: 0,
  };

  if (correct) {
    mastery.correctCount += 1;
    mastery.lastPracticed = Date.now();
  }
  mastery.totalAttempts += 1;

  level.adjectiveMastery[adjectiveId][comboKey] = mastery;
  return updated;
}

export function unlockAdverbLevel(
  progress: AdverbProgress,
  levelId: AdverbLevelId,
): AdverbProgress {
  const updated = structuredClone(progress);
  updated.levels[levelId].unlocked = true;
  return updated;
}
