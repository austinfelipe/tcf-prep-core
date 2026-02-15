import { test, expect } from '@playwright/test';
import {
  seedProgress,
  PROGRESS_VERSION,
  buildMasteredCombo,
} from './helpers/seed';

test.describe('Accent feedback', () => {
  test('typing without accents shows amber "Almost! Check your accents"', async ({ page }) => {
    // Seed être with all combos mastered EXCEPT présent:vous → forces that question
    const tenses = ['présent', 'futur_proche', 'passé_composé'] as const;
    const pronouns = ['je', 'tu', 'il', 'nous', 'vous', 'ils'] as const;

    const etreMastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {};
    for (const tense of tenses) {
      for (const pronoun of pronouns) {
        if (tense === 'présent' && pronoun === 'vous') continue;
        etreMastery[`${tense}:${pronoun}`] = buildMasteredCombo();
      }
    }

    const progress = {
      version: PROGRESS_VERSION,
      levels: {
        a1: { unlocked: true, verbMastery: { etre: etreMastery }, testAttempts: [], testPassed: false },
        a2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
        b1: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
        b2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      },
    };

    await seedProgress(page, progress);
    await page.goto('/level/a1/practice/etre');
    await page.getByPlaceholder('Type conjugation...').waitFor();

    // The forced question should be présent:vous → "vous êtes"
    // Type without accent
    await page.getByPlaceholder('Type conjugation...').fill('vous etes');
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Almost! Check your accents')).toBeVisible();
    await expect(page.getByText('vous êtes')).toBeVisible();
  });
});
