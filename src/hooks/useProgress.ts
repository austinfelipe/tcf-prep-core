'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, TestAttempt } from '@/types/progress';
import { LevelId } from '@/types/level';
import {
  loadProgress,
  saveProgress,
  updateVerbCombo,
  unlockLevel,
  resetProgress as resetStoredProgress,
  createDefaultProgress,
} from '@/lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const update = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const current = prev ?? createDefaultProgress();
      const next = updater(current);
      saveProgress(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback(
    (levelId: LevelId, verbId: string, comboKey: string, correct: boolean) => {
      update((prev) => updateVerbCombo(prev, levelId, verbId, comboKey, correct));
    },
    [update]
  );

  const recordTestAttempt = useCallback(
    (levelId: LevelId, attempt: TestAttempt) => {
      update((prev) => {
        const updated = structuredClone(prev);
        updated.levels[levelId].testAttempts.push(attempt);
        if (attempt.passed) {
          updated.levels[levelId].testPassed = true;
        }
        return updated;
      });
    },
    [update]
  );

  const unlock = useCallback(
    (levelId: LevelId) => {
      update((prev) => unlockLevel(prev, levelId));
    },
    [update]
  );

  const resetAll = useCallback(() => {
    resetStoredProgress();
    setProgress(createDefaultProgress());
  }, []);

  return {
    progress,
    isLoaded: progress !== null,
    recordAnswer,
    recordTestAttempt,
    unlock,
    resetAll,
  };
}
