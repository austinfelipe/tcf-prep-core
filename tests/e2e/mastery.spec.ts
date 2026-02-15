import { test, expect } from '@playwright/test';
import {
  seedProgress,
  clearProgress,
  PROGRESS_VERSION,
  buildMasteredCombo,
  buildFullVerbMastery,
  A1_TENSES,
  ALL_PRONOUNS,
} from './helpers/seed';
import { lookupAnswer } from './helpers/answer-map';
import { Page } from '@playwright/test';

async function readQuestion(page: Page) {
  const infinitive = await page.locator('h2').first().innerText();
  const tenseDisplay = await page.locator('.bg-blue-100').innerText();
  const pronounEl = page.locator('.text-xl.text-gray-700 .font-medium');
  const pronounDisplay = await pronounEl.innerText();
  return { infinitive, tenseDisplay, pronounDisplay };
}

test.describe('Mastery progression', () => {
  test('near-mastered verb shows "Verb dominated!" after final correct answer', async ({ page }) => {
    // Seed être with 17/18 combos mastered, présent:je at 2 correct
    const etreMastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {};
    for (const tense of A1_TENSES) {
      for (const pronoun of ALL_PRONOUNS) {
        if (tense === 'présent' && pronoun === 'je') {
          etreMastery[`${tense}:${pronoun}`] = {
            correctCount: 2,
            totalAttempts: 2,
            lastPracticed: Date.now(),
          };
        } else {
          etreMastery[`${tense}:${pronoun}`] = buildMasteredCombo();
        }
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

    // Should be présent:je → "je suis"
    await page.getByPlaceholder('Type conjugation...').fill('je suis');
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
    await expect(page.getByText('Verb dominated!')).toBeVisible();
  });

  test('progress persists after reload', async ({ page }) => {
    // Clear via page.evaluate (not addInitScript) so it doesn't re-run on reload
    await page.goto('/level/a1/practice/etre');
    await page.evaluate(() => localStorage.removeItem('tcf-prep-progress'));
    await page.reload();
    await page.getByPlaceholder('Type conjugation...').waitFor();

    await expect(page.getByText('0 / 54 correct answers')).toBeVisible();

    const { infinitive, tenseDisplay, pronounDisplay } = await readQuestion(page);
    const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);

    await page.getByPlaceholder('Type conjugation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Progress should increase (React Strict Mode in dev may double-count)
    await expect(page.getByText('0 / 54 correct answers')).not.toBeVisible({ timeout: 10000 });
    const progressText = page.getByText(/\d+ \/ 54 correct answers/);
    await expect(progressText).toBeVisible();

    // Capture the exact progress text before reload
    const textBefore = await progressText.innerText();

    await page.reload();
    await page.getByPlaceholder('Type conjugation...').waitFor();
    await expect(page.getByText(textBefore)).toBeVisible({ timeout: 10000 });
  });

  test('dominated verb unlocks next verb on tree', async ({ page }) => {
    // Seed être as dominated
    const progress = {
      version: PROGRESS_VERSION,
      levels: {
        a1: {
          unlocked: true,
          verbMastery: {
            etre: buildFullVerbMastery(A1_TENSES, ALL_PRONOUNS),
          },
          testAttempts: [],
          testPassed: false,
        },
        a2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
        b1: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
        b2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      },
    };

    await seedProgress(page, progress);
    await page.goto('/level/a1');

    // avoir should now be a clickable link (unlocked by être being dominated)
    const avoirLink = page.locator('a[href="/level/a1/practice/avoir"]');
    await expect(avoirLink).toHaveCount(1);
  });
});
