'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdverbProgress, AdverbLevelId, AdverbComboType } from '@/types/adverb';
import {
  loadAdverbProgress,
  saveAdverbProgress,
  updateAdverbComboMastery,
  unlockAdverbLevel,
  resetAdverbProgress as resetStoredProgress,
  createDefaultAdverbProgress,
} from '@/lib/adverbStorage';

export function useAdverbProgress() {
  const [progress, setProgress] = useState<AdverbProgress | null>(null);

  useEffect(() => {
    setProgress(loadAdverbProgress());
  }, []);

  const update = useCallback((updater: (prev: AdverbProgress) => AdverbProgress) => {
    setProgress((prev) => {
      const current = prev ?? createDefaultAdverbProgress();
      const next = updater(current);
      saveAdverbProgress(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback(
    (levelId: AdverbLevelId, adjectiveId: string, comboKey: AdverbComboType, correct: boolean) => {
      update((prev) => updateAdverbComboMastery(prev, levelId, adjectiveId, comboKey, correct));
    },
    [update],
  );

  const unlock = useCallback(
    (levelId: AdverbLevelId) => {
      update((prev) => unlockAdverbLevel(prev, levelId));
    },
    [update],
  );

  const resetAll = useCallback(() => {
    resetStoredProgress();
    setProgress(createDefaultAdverbProgress());
  }, []);

  return {
    progress,
    isLoaded: progress !== null,
    recordAnswer,
    unlock,
    resetAll,
  };
}
