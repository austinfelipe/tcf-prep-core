export type TranslationLevelId = 'a1' | 'a2' | 'b1' | 'b2';

export interface TranslationPhrase {
  id: string;
  level: TranslationLevelId;
  english: string;
  acceptedAnswers: string[];
}

export interface TranslationLevelDefinition {
  id: TranslationLevelId;
  label: string;
  description: string;
  phraseIds: string[];
}

export interface PhraseMastery {
  correctCount: number;
  totalAttempts: number;
  lastPracticed: number;
}

export interface TranslationLevelProgress {
  unlocked: boolean;
  phraseMastery: {
    [phraseId: string]: PhraseMastery;
  };
}

export interface TranslationProgress {
  version: number;
  levels: {
    [key in TranslationLevelId]: TranslationLevelProgress;
  };
}

export const TRANSLATION_PROGRESS_VERSION = 1;
export const TRANSLATION_STORAGE_KEY = 'tcf-prep-translation-progress';
