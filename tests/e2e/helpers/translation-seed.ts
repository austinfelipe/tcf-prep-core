import { Page } from '@playwright/test';

const TRANSLATION_STORAGE_KEY = 'tcf-prep-translation-progress';
const TRANSLATION_PROGRESS_VERSION = 1;

const A1_PHRASE_IDS = [
  'a1-01', 'a1-02', 'a1-03', 'a1-04', 'a1-05',
  'a1-06', 'a1-07', 'a1-08', 'a1-09', 'a1-10',
  'a1-11', 'a1-12', 'a1-13', 'a1-14', 'a1-15',
  'a1-16', 'a1-17', 'a1-18', 'a1-19', 'a1-20',
];

function buildMasteredPhrase() {
  return { correctCount: 3, totalAttempts: 3, lastPracticed: Date.now() };
}

function buildAllA1Mastered() {
  const phraseMastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {};
  for (const id of A1_PHRASE_IDS) {
    phraseMastery[id] = buildMasteredPhrase();
  }
  return {
    version: TRANSLATION_PROGRESS_VERSION,
    levels: {
      a1: { unlocked: true, phraseMastery },
      a2: { unlocked: false, phraseMastery: {} },
      b1: { unlocked: false, phraseMastery: {} },
      b2: { unlocked: false, phraseMastery: {} },
    },
  };
}

async function seedTranslationProgress(page: Page, progressObject: unknown) {
  const json = JSON.stringify(progressObject);
  await page.addInitScript((data: string) => {
    localStorage.setItem('tcf-prep-translation-progress', data);
  }, json);
}

async function clearTranslationProgress(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('tcf-prep-translation-progress');
  });
}

export {
  TRANSLATION_STORAGE_KEY,
  TRANSLATION_PROGRESS_VERSION,
  A1_PHRASE_IDS,
  buildMasteredPhrase,
  buildAllA1Mastered,
  seedTranslationProgress,
  clearTranslationProgress,
};
