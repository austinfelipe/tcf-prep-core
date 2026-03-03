'use client';

import { useState, useEffect, useCallback } from 'react';
import { TranslationProgress, TranslationLevelId } from '@/types/translation';
import {
  loadTranslationProgress,
  saveTranslationProgress,
  updatePhraseMastery,
  unlockTranslationLevel,
  resetTranslationProgress as resetStoredProgress,
  createDefaultTranslationProgress,
} from '@/lib/translationStorage';

export function useTranslationProgress() {
  const [progress, setProgress] = useState<TranslationProgress | null>(null);

  useEffect(() => {
    setProgress(loadTranslationProgress());
  }, []);

  const update = useCallback((updater: (prev: TranslationProgress) => TranslationProgress) => {
    setProgress((prev) => {
      const current = prev ?? createDefaultTranslationProgress();
      const next = updater(current);
      saveTranslationProgress(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback(
    (levelId: TranslationLevelId, phraseId: string, correct: boolean) => {
      update((prev) => updatePhraseMastery(prev, levelId, phraseId, correct));
    },
    [update],
  );

  const unlock = useCallback(
    (levelId: TranslationLevelId) => {
      update((prev) => unlockTranslationLevel(prev, levelId));
    },
    [update],
  );

  const resetAll = useCallback(() => {
    resetStoredProgress();
    setProgress(createDefaultTranslationProgress());
  }, []);

  return {
    progress,
    isLoaded: progress !== null,
    recordAnswer,
    unlock,
    resetAll,
  };
}
