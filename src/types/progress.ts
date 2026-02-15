import { LevelId } from './level';

export interface ComboMastery {
  correctCount: number;
  totalAttempts: number;
  lastPracticed: number;
}

export interface VerbMasteryData {
  [comboKey: string]: ComboMastery; // key: `${tense}:${pronoun}`
}

export interface TestAttempt {
  date: number;
  score: number;
  total: number;
  passed: boolean;
}

export interface LevelProgress {
  unlocked: boolean;
  verbMastery: {
    [verbId: string]: VerbMasteryData;
  };
  testAttempts: TestAttempt[];
  testPassed: boolean;
}

export interface UserProgress {
  version: number;
  levels: {
    [key in LevelId]: LevelProgress;
  };
}

export const PROGRESS_VERSION = 1;
export const STORAGE_KEY = 'tcf-prep-progress';
