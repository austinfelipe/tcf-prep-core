'use client';

import { useState, useCallback, useMemo } from 'react';
import { LevelDefinition } from '@/types/level';
import { VerbEntry } from '@/types/conjugation';
import { TestQuestion, generateTestQuestions } from '@/lib/testGenerator';
import { validateAnswer, ValidationResult } from '@/lib/validation';
import { useProgress } from './useProgress';

export interface TestAnswer {
  question: TestQuestion;
  userAnswer: string;
  result: ValidationResult;
}

export type TestPhase = 'ready' | 'in_progress' | 'finished';

export function useTestSession(level: LevelDefinition, verbs: VerbEntry[]) {
  const { progress, isLoaded, recordTestAttempt, unlock } = useProgress();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [phase, setPhase] = useState<TestPhase>('ready');

  const startTest = useCallback(() => {
    const generated = generateTestQuestions(level, verbs);
    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase('in_progress');
  }, [level, verbs]);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (phase !== 'in_progress' || currentIndex >= questions.length) return;

      const question = questions[currentIndex];
      const result = validateAnswer(answer, question.acceptedAnswers);
      const newAnswer: TestAnswer = { question, userAnswer: answer, result };

      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);

      if (currentIndex + 1 >= questions.length) {
        // Test complete
        const correctCount = newAnswers.filter((a) => a.result.correct).length;
        const total = newAnswers.length;
        const passed = correctCount / total >= level.passThreshold;

        recordTestAttempt(level.id, {
          date: Date.now(),
          score: correctCount,
          total,
          passed,
        });

        // Unlock next level if passed
        if (passed) {
          const levelOrder = ['a1', 'a2', 'b1', 'b2'] as const;
          const currentIdx = levelOrder.indexOf(level.id);
          if (currentIdx < levelOrder.length - 1) {
            unlock(levelOrder[currentIdx + 1]);
          }
        }

        setPhase('finished');
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [phase, currentIndex, questions, answers, level, recordTestAttempt, unlock]
  );

  const score = useMemo(() => {
    const correct = answers.filter((a) => a.result.correct).length;
    return { correct, total: answers.length };
  }, [answers]);

  const passed = useMemo(() => {
    if (phase !== 'finished') return false;
    return score.total > 0 && score.correct / score.total >= level.passThreshold;
  }, [phase, score, level.passThreshold]);

  return {
    isLoaded,
    phase,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    answers,
    score,
    passed,
    startTest,
    submitAnswer,
  };
}
