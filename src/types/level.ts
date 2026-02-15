import { Tense } from './conjugation';

export type LevelId = 'a1' | 'a2' | 'b1' | 'b2';

export interface LevelDefinition {
  id: LevelId;
  label: string;
  description: string;
  tenses: Tense[];
  verbIds: string[];
  testQuestionCount: number;
  passThreshold: number;
}
