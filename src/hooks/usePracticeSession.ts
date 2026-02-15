'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { VerbEntry, Tense } from '@/types/conjugation';
import { VerbMasteryData } from '@/types/progress';
import { LevelId } from '@/types/level';
import {
  selectPracticeQuestion,
  isVerbDominated,
  getVerbProgress,
  getCombosForVerb,
  isComboMastered,
} from '@/lib/mastery';
import { validateAnswer, ValidationResult } from '@/lib/validation';
import { useProgress } from './useProgress';

export interface PracticeState {
  tense: Tense;
  pronoun: string;
  acceptedAnswers: string[];
  result: ValidationResult | null;
  userAnswer: string;
}

export interface DetailedVerbProgress {
  mastered: number;
  total: number;
  totalCorrect: number;
  totalNeeded: number; // total combos × 3
}

export function usePracticeSession(
  verb: VerbEntry,
  tenses: Tense[],
  levelId: LevelId
) {
  const { progress, isLoaded, recordAnswer } = useProgress();

  const verbMastery = useMemo(
    () => progress?.levels[levelId]?.verbMastery[verb.id],
    [progress, levelId, verb.id]
  );

  // Use a ref so nextQuestion always reads the latest mastery
  const verbMasteryRef = useRef(verbMastery);
  verbMasteryRef.current = verbMastery;

  const [state, setState] = useState<PracticeState | null>(null);

  const nextQuestion = useCallback(() => {
    const currentMastery = verbMasteryRef.current;
    const question = selectPracticeQuestion(verb, tenses, currentMastery);
    setState({
      tense: question.tense,
      pronoun: question.pronoun,
      acceptedAnswers: question.acceptedAnswers,
      result: null,
      userAnswer: '',
    });
  }, [verb, tenses]);

  const submitAnswer = useCallback(
    (answer: string) => {
      setState((prev) => {
        if (!prev) return null;
        const result = validateAnswer(answer, prev.acceptedAnswers);
        const comboKey = `${prev.tense}:${prev.pronoun}`;
        recordAnswer(levelId, verb.id, comboKey, result.correct);
        return { ...prev, result, userAnswer: answer };
      });
    },
    [levelId, verb.id, recordAnswer]
  );

  const dominated = useMemo(
    () => isVerbDominated(verbMastery, verb, tenses),
    [verbMastery, verb, tenses]
  );

  const verbProgress: DetailedVerbProgress = useMemo(() => {
    const base = getVerbProgress(verbMastery, verb, tenses);
    const combos = getCombosForVerb(verb, tenses);
    let totalCorrect = 0;
    for (const comboKey of combos) {
      const combo = verbMastery?.[comboKey];
      if (combo) {
        totalCorrect += Math.min(combo.correctCount, 3);
      }
    }
    return {
      ...base,
      totalCorrect,
      totalNeeded: combos.length * 3,
    };
  }, [verbMastery, verb, tenses]);

  return {
    isLoaded,
    state,
    nextQuestion,
    submitAnswer,
    dominated,
    verbProgress,
  };
}
