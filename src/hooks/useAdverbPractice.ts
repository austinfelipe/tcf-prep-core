'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { AdjectiveEntry, AdverbLevelId, AdverbComboType, AdjectiveMasteryData } from '@/types/adverb';
import {
  selectNextQuestion,
  isComboMastered,
  areAllAdjectivesMastered,
  getCombosForAdjective,
} from '@/lib/adverbMastery';
import { validateAnswer, ValidationResult } from '@/lib/validation';
import { useAdverbProgress } from './useAdverbProgress';

export interface AdverbPracticeState {
  adjective: AdjectiveEntry;
  combo: AdverbComboType;
  result: ValidationResult | null;
  userAnswer: string;
}

export interface AdverbLevelStats {
  mastered: number;
  total: number;
  totalCorrect: number;
  totalNeeded: number;
}

export function useAdverbPractice(
  adjectives: AdjectiveEntry[],
  levelId: AdverbLevelId,
) {
  const { progress, isLoaded, recordAnswer } = useAdverbProgress();

  const adjectiveMastery = useMemo(
    () => progress?.levels[levelId]?.adjectiveMastery ?? {},
    [progress, levelId],
  );

  const adjectiveMasteryRef = useRef(adjectiveMastery);
  adjectiveMasteryRef.current = adjectiveMastery;

  const [state, setState] = useState<AdverbPracticeState | null>(null);

  const nextQuestion = useCallback(() => {
    const currentMastery = adjectiveMasteryRef.current;
    const { adjective, combo } = selectNextQuestion(adjectives, currentMastery);
    setState({
      adjective,
      combo,
      result: null,
      userAnswer: '',
    });
  }, [adjectives]);

  const submitAnswer = useCallback(
    (answer: string) => {
      setState((prev) => {
        if (!prev) return null;
        const acceptedAnswers = prev.combo === 'féminin'
          ? prev.adjective.feminine
          : prev.adjective.adverb!;
        const result = validateAnswer(answer, acceptedAnswers);
        recordAnswer(levelId, prev.adjective.id, prev.combo, result.correct);
        return { ...prev, result, userAnswer: answer };
      });
    },
    [levelId, recordAnswer],
  );

  const allMastered = useMemo(
    () => areAllAdjectivesMastered(
      { unlocked: true, adjectiveMastery },
      adjectives,
    ),
    [adjectiveMastery, adjectives],
  );

  const levelStats: AdverbLevelStats = useMemo(() => {
    let totalCombos = 0;
    let mastered = 0;
    let totalCorrect = 0;

    for (const adj of adjectives) {
      const combos = getCombosForAdjective(adj);
      const masteryData: AdjectiveMasteryData = adjectiveMastery[adj.id] ?? {};

      for (const combo of combos) {
        totalCombos++;
        const m = masteryData[combo];
        if (isComboMastered(m)) mastered++;
        if (m) totalCorrect += Math.min(m.correctCount, 3);
      }
    }

    return {
      mastered,
      total: totalCombos,
      totalCorrect,
      totalNeeded: totalCombos * 3,
    };
  }, [adjectiveMastery, adjectives]);

  return {
    isLoaded,
    state,
    nextQuestion,
    submitAnswer,
    allMastered,
    levelStats,
  };
}
