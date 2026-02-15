import { Page } from '@playwright/test';

const STORAGE_KEY = 'tcf-prep-progress';
const PROGRESS_VERSION = 1;

const A1_VERB_IDS = [
  'etre', 'avoir', 'faire', 'aller', 'pouvoir',
  'vouloir', 'devoir', 'savoir', 'dire', 'venir',
  'prendre', 'mettre', 'voir', 'parler', 'manger',
];

const A1_TENSES = ['présent', 'futur_proche', 'passé_composé'] as const;

const ALL_PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'] as const;

function buildMasteredCombo() {
  return { correctCount: 3, totalAttempts: 3, lastPracticed: Date.now() };
}

function buildFullVerbMastery(
  tenses: readonly string[],
  pronouns: readonly string[],
) {
  const mastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {};
  for (const tense of tenses) {
    for (const pronoun of pronouns) {
      mastery[`${tense}:${pronoun}`] = buildMasteredCombo();
    }
  }
  return mastery;
}

function buildAllA1Dominated() {
  const verbMastery: Record<string, Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }>> = {};
  for (const verbId of A1_VERB_IDS) {
    verbMastery[verbId] = buildFullVerbMastery(A1_TENSES, ALL_PRONOUNS);
  }
  return {
    version: PROGRESS_VERSION,
    levels: {
      a1: { unlocked: true, verbMastery, testAttempts: [], testPassed: false },
      a2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      b1: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      b2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
    },
  };
}

async function seedProgress(page: Page, progressObject: unknown) {
  const json = JSON.stringify(progressObject);
  await page.addInitScript((data: string) => {
    localStorage.setItem('tcf-prep-progress', data);
  }, json);
}

async function clearProgress(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('tcf-prep-progress');
  });
}

export {
  STORAGE_KEY,
  PROGRESS_VERSION,
  A1_VERB_IDS,
  A1_TENSES,
  ALL_PRONOUNS,
  buildMasteredCombo,
  buildFullVerbMastery,
  buildAllA1Dominated,
  seedProgress,
  clearProgress,
};
