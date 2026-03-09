import { Page } from '@playwright/test';

const ADVERB_STORAGE_KEY = 'tcf-prep-adverb-progress';
const ADVERB_PROGRESS_VERSION = 1;

const A1_ADJECTIVE_IDS = [
  'a1-bon', 'a1-mauvais', 'a1-grand', 'a1-petit', 'a1-beau',
  'a1-joli', 'a1-jeune', 'a1-vieux', 'a1-nouveau', 'a1-gros',
  'a1-long', 'a1-court', 'a1-chaud', 'a1-froid', 'a1-blanc',
  'a1-noir', 'a1-rouge', 'a1-bleu', 'a1-vert', 'a1-content',
  'a1-triste', 'a1-facile', 'a1-difficile', 'a1-rapide', 'a1-lent',
  'a1-premier', 'a1-dernier', 'a1-seul', 'a1-tout', 'a1-autre',
];

// Adjectives without adverb (only féminin combo)
const A1_NO_ADVERB = new Set(['a1-rouge', 'a1-bleu']);

function buildMasteredCombo() {
  return { correctCount: 3, totalAttempts: 3, lastPracticed: Date.now() };
}

function buildFullAdjectiveMastery(adjectiveId: string) {
  const mastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {
    'féminin': buildMasteredCombo(),
  };
  if (!A1_NO_ADVERB.has(adjectiveId)) {
    mastery['adverbe'] = buildMasteredCombo();
  }
  return mastery;
}

function buildAllA1Mastered() {
  const adjectiveMastery: Record<string, Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }>> = {};
  for (const id of A1_ADJECTIVE_IDS) {
    adjectiveMastery[id] = buildFullAdjectiveMastery(id);
  }
  return {
    version: ADVERB_PROGRESS_VERSION,
    levels: {
      a1: { unlocked: true, adjectiveMastery },
      a2: { unlocked: false, adjectiveMastery: {} },
      b1: { unlocked: false, adjectiveMastery: {} },
      b2: { unlocked: false, adjectiveMastery: {} },
    },
  };
}

async function seedAdverbProgress(page: Page, progressObject: unknown) {
  const json = JSON.stringify(progressObject);
  await page.addInitScript((data: string) => {
    localStorage.setItem('tcf-prep-adverb-progress', data);
  }, json);
}

async function clearAdverbProgress(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('tcf-prep-adverb-progress');
  });
}

export {
  ADVERB_STORAGE_KEY,
  ADVERB_PROGRESS_VERSION,
  A1_ADJECTIVE_IDS,
  A1_NO_ADVERB,
  buildMasteredCombo,
  buildFullAdjectiveMastery,
  buildAllA1Mastered,
  seedAdverbProgress,
  clearAdverbProgress,
};
