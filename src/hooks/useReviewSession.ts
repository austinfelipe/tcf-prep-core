'use client';

import { useState, useCallback, useMemo } from 'react';
import { validateAnswer, ValidationResult } from '@/lib/validation';
import { collectReviewItems, selectReviewSession, ReviewItem } from '@/lib/review';
import { useProgress } from './useProgress';

export interface ReviewAnswer {
  item: ReviewItem;
  userAnswer: string;
  result: ValidationResult;
}

export type ReviewPhase = 'loading' | 'empty' | 'ready' | 'in_progress' | 'finished';

export function useReviewSession() {
  const { progress, isLoaded, recordAnswer } = useProgress();

  const [session, setSession] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ReviewAnswer[]>([]);
  const [phase, setPhase] = useState<ReviewPhase>('loading');
  const [allItems, setAllItems] = useState<ReviewItem[]>([]);
  const [lastResult, setLastResult] = useState<{ result: ValidationResult; userAnswer: string } | null>(null);

  // Initialize items when progress loads
  useMemo(() => {
    if (isLoaded && progress && phase === 'loading') {
      const items = collectReviewItems(progress);
      setAllItems(items);
      if (items.length === 0) {
        setPhase('empty');
      } else {
        setPhase('ready');
      }
    }
  }, [isLoaded, progress, phase]);

  const dueVerbCount = useMemo(() => {
    return new Set(allItems.map((i) => i.verbId)).size;
  }, [allItems]);

  const sessionSize = useMemo(() => {
    return Math.min(20, allItems.length);
  }, [allItems]);

  const startSession = useCallback(() => {
    const selected = selectReviewSession(allItems, 20);
    setSession(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setLastResult(null);
    setPhase('in_progress');
  }, [allItems]);

  const currentItem = session[currentIndex] ?? null;

  const submitAnswer = useCallback(
    (answer: string) => {
      if (phase !== 'in_progress' || !currentItem || lastResult) return;

      const result = validateAnswer(answer, currentItem.acceptedAnswers);
      recordAnswer(currentItem.levelId, currentItem.verbId, currentItem.comboKey, result.correct);

      setAnswers((prev) => [...prev, { item: currentItem, userAnswer: answer, result }]);
      setLastResult({ result, userAnswer: answer });
    },
    [phase, currentItem, lastResult, recordAnswer],
  );

  const nextQuestion = useCallback(() => {
    if (!lastResult) return;
    setLastResult(null);

    if (currentIndex + 1 >= session.length) {
      setPhase('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [lastResult, currentIndex, session.length]);

  const score = useMemo(() => {
    const correct = answers.filter((a) => a.result.correct).length;
    return { correct, incorrect: answers.length - correct, total: answers.length };
  }, [answers]);

  const restartSession = useCallback(() => {
    if (!progress) return;

    // Only retry combos answered incorrectly in the last session
    const wrongComboKeys = new Set(
      answers
        .filter((a) => !a.result.correct)
        .map((a) => `${a.item.levelId}:${a.item.verbId}:${a.item.comboKey}`)
    );

    if (wrongComboKeys.size === 0) {
      setAllItems([]);
      setPhase('empty');
      return;
    }

    const items = collectReviewItems(progress).filter((item) =>
      wrongComboKeys.has(`${item.levelId}:${item.verbId}:${item.comboKey}`)
    );

    setAllItems(items);
    if (items.length === 0) {
      setPhase('empty');
    } else {
      const selected = selectReviewSession(items, 20);
      setSession(selected);
      setCurrentIndex(0);
      setAnswers([]);
      setLastResult(null);
      setPhase('in_progress');
    }
  }, [progress, answers]);

  return {
    phase,
    dueVerbCount,
    sessionSize,
    currentItem,
    currentIndex,
    sessionLength: session.length,
    answers,
    score,
    lastResult,
    startSession,
    submitAnswer,
    nextQuestion,
    restartSession,
  };
}
