'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { TranslationPhrase, TranslationLevelId } from '@/types/translation';
import { selectNextPhrase, isPhraseMastered, areAllPhrasesMastered } from '@/lib/translationMastery';
import { validateAnswer, ValidationResult } from '@/lib/validation';
import { useTranslationProgress } from './useTranslationProgress';

export interface TranslationPracticeState {
  phrase: TranslationPhrase;
  result: ValidationResult | null;
  userAnswer: string;
}

export interface TranslationLevelStats {
  mastered: number;
  total: number;
  totalCorrect: number;
  totalNeeded: number; // total phrases × 3
}

export function useTranslationPractice(
  phrases: TranslationPhrase[],
  levelId: TranslationLevelId,
) {
  const { progress, isLoaded, recordAnswer } = useTranslationProgress();

  const phraseMastery = useMemo(
    () => progress?.levels[levelId]?.phraseMastery ?? {},
    [progress, levelId],
  );

  const phraseMasteryRef = useRef(phraseMastery);
  phraseMasteryRef.current = phraseMastery;

  const [state, setState] = useState<TranslationPracticeState | null>(null);

  const nextQuestion = useCallback(() => {
    const currentMastery = phraseMasteryRef.current;
    const phrase = selectNextPhrase(phrases, currentMastery);
    setState({
      phrase,
      result: null,
      userAnswer: '',
    });
  }, [phrases]);

  const submitAnswer = useCallback(
    (answer: string) => {
      setState((prev) => {
        if (!prev) return null;
        const result = validateAnswer(answer, prev.phrase.acceptedAnswers);
        recordAnswer(levelId, prev.phrase.id, result.correct);
        return { ...prev, result, userAnswer: answer };
      });
    },
    [levelId, recordAnswer],
  );

  const allMastered = useMemo(
    () => areAllPhrasesMastered(
      { unlocked: true, phraseMastery },
      phrases.map((p) => p.id),
    ),
    [phraseMastery, phrases],
  );

  const levelStats: TranslationLevelStats = useMemo(() => {
    const total = phrases.length;
    let mastered = 0;
    let totalCorrect = 0;
    for (const phrase of phrases) {
      const m = phraseMastery[phrase.id];
      if (isPhraseMastered(m)) mastered++;
      if (m) totalCorrect += Math.min(m.correctCount, 3);
    }
    return {
      mastered,
      total,
      totalCorrect,
      totalNeeded: total * 3,
    };
  }, [phraseMastery, phrases]);

  return {
    isLoaded,
    state,
    nextQuestion,
    submitAnswer,
    allMastered,
    levelStats,
  };
}
