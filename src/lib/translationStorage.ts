import {
  TranslationProgress,
  TranslationLevelProgress,
  TranslationLevelId,
  TRANSLATION_PROGRESS_VERSION,
  TRANSLATION_STORAGE_KEY,
} from '@/types/translation';

function createDefaultLevelProgress(unlocked: boolean): TranslationLevelProgress {
  return {
    unlocked,
    phraseMastery: {},
  };
}

export function createDefaultTranslationProgress(): TranslationProgress {
  return {
    version: TRANSLATION_PROGRESS_VERSION,
    levels: {
      a1: createDefaultLevelProgress(true),
      a2: createDefaultLevelProgress(false),
      b1: createDefaultLevelProgress(false),
      b2: createDefaultLevelProgress(false),
    },
  };
}

export function loadTranslationProgress(): TranslationProgress {
  if (typeof window === 'undefined') return createDefaultTranslationProgress();

  try {
    const raw = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (!raw) return createDefaultTranslationProgress();
    const parsed = JSON.parse(raw) as TranslationProgress;
    if (parsed.version !== TRANSLATION_PROGRESS_VERSION) {
      return createDefaultTranslationProgress();
    }
    return parsed;
  } catch {
    return createDefaultTranslationProgress();
  }
}

export function saveTranslationProgress(progress: TranslationProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save translation progress to localStorage');
  }
}

export function resetTranslationProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRANSLATION_STORAGE_KEY);
}

export function updatePhraseMastery(
  progress: TranslationProgress,
  levelId: TranslationLevelId,
  phraseId: string,
  correct: boolean,
): TranslationProgress {
  const updated = structuredClone(progress);
  const level = updated.levels[levelId];

  const mastery = level.phraseMastery[phraseId] ?? {
    correctCount: 0,
    totalAttempts: 0,
    lastPracticed: 0,
  };

  if (correct) {
    mastery.correctCount += 1;
    mastery.lastPracticed = Date.now();
  }
  mastery.totalAttempts += 1;

  level.phraseMastery[phraseId] = mastery;
  return updated;
}

export function unlockTranslationLevel(
  progress: TranslationProgress,
  levelId: TranslationLevelId,
): TranslationProgress {
  const updated = structuredClone(progress);
  updated.levels[levelId].unlocked = true;
  return updated;
}
