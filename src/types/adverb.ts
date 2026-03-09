export type AdverbLevelId = 'a1' | 'a2' | 'b1' | 'b2';

export type AdverbComboType = 'féminin' | 'adverbe';

export interface AdjectiveEntry {
  id: string;
  level: AdverbLevelId;
  masculine: string;
  feminine: string[];
  adverb: string[] | null;
  english: string;
}

export interface AdverbLevelDefinition {
  id: AdverbLevelId;
  label: string;
  description: string;
  adjectiveIds: string[];
}

export interface AdverbComboMastery {
  correctCount: number;
  totalAttempts: number;
  lastPracticed: number;
}

export interface AdjectiveMasteryData {
  [comboKey: string]: AdverbComboMastery;
}

export interface AdverbLevelProgress {
  unlocked: boolean;
  adjectiveMastery: {
    [adjectiveId: string]: AdjectiveMasteryData;
  };
}

export interface AdverbProgress {
  version: number;
  levels: {
    [key in AdverbLevelId]: AdverbLevelProgress;
  };
}

export const ADVERB_PROGRESS_VERSION = 1;
export const ADVERB_STORAGE_KEY = 'tcf-prep-adverb-progress';
