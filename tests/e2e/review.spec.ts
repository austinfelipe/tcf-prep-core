import { test, expect } from '@playwright/test';
import {
  clearProgress,
  seedProgress,
  buildStaleVerbProgress,
  PROGRESS_VERSION,
  A1_TENSES,
  ALL_PRONOUNS,
} from './helpers/seed';
import { lookupAnswer } from './helpers/answer-map';

/** Build progress with a single stale verb so the review session is short. */
function buildProgressWithStaleVerb() {
  return {
    version: PROGRESS_VERSION,
    levels: {
      a1: {
        unlocked: true,
        verbMastery: {
          etre: buildStaleVerbProgress('etre', A1_TENSES, ALL_PRONOUNS, 5),
        },
        testAttempts: [],
        testPassed: false,
      },
      a2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      b1: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
      b2: { unlocked: false, verbMastery: {}, testAttempts: [], testPassed: false },
    },
  };
}

test.describe('Review page', () => {
  test.describe('empty state', () => {
    test.beforeEach(async ({ page }) => {
      await clearProgress(page);
      await page.goto('/review');
    });

    test('shows "No verbs due for review"', async ({ page }) => {
      await expect(
        page.getByText('No verbs due for review'),
      ).toBeVisible();
    });

    test('"Back to Conjugation" navigates to /conjugation', async ({ page }) => {
      await page.getByRole('button', { name: 'Back to Conjugation' }).click();
      await expect(page).toHaveURL(/\/conjugation/);
    });
  });

  test.describe('ready state', () => {
    test.beforeEach(async ({ page }) => {
      await clearProgress(page);
      await seedProgress(page, buildProgressWithStaleVerb());
      await page.goto('/review');
    });

    test('shows due verb count and Start Review button', async ({ page }) => {
      await expect(page.getByText(/1 verb.* due/)).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Start Review' }),
      ).toBeVisible();
    });
  });

  test.describe('in-progress', () => {
    test.beforeEach(async ({ page }) => {
      await clearProgress(page);
      await seedProgress(page, buildProgressWithStaleVerb());
      await page.goto('/review');
      await page.getByRole('button', { name: 'Start Review' }).click();
    });

    test('shows conjugation prompt with progress counter', async ({ page }) => {
      await expect(page.getByText(/1 \//)).toBeVisible();
      await expect(page.getByPlaceholder('Type conjugation...')).toBeVisible();
    });

    test('correct answer shows green "Correct!" feedback', async ({ page }) => {
      const infinitive = await page.locator('h2').first().innerText();
      const tenseDisplay = await page.locator('.bg-blue-100').innerText();
      const pronounDisplay = await page
        .locator('.text-xl.text-gray-700 .font-medium')
        .innerText();

      const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);
      await page.getByPlaceholder('Type conjugation...').fill(answer);
      await page.getByRole('button', { name: 'Check' }).click();

      await expect(page.getByText('Correct!')).toBeVisible();
    });
  });

  test.describe('completion', () => {
    test('finishing all questions shows "Review Complete!" with score', async ({ page }) => {
      await clearProgress(page);
      await seedProgress(page, buildProgressWithStaleVerb());
      await page.goto('/review');
      await page.getByRole('button', { name: 'Start Review' }).click();

      // Answer all questions in the session
      const totalText = await page.getByText(/\d+ \/ \d+/).first().innerText();
      const total = parseInt(totalText.split('/')[1].trim(), 10);

      for (let i = 0; i < total; i++) {
        const infinitive = await page.locator('h2').first().innerText();
        const tenseDisplay = await page.locator('.bg-blue-100').innerText();
        const pronounDisplay = await page
          .locator('.text-xl.text-gray-700 .font-medium')
          .innerText();

        const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);
        await page.getByPlaceholder('Type conjugation...').fill(answer);
        await page.getByRole('button', { name: 'Check' }).click();
        await expect(page.getByText('Correct!')).toBeVisible();

        if (i < total - 1) {
          await page.getByRole('button', { name: 'Next Question' }).click();
        } else {
          await page.getByRole('button', { name: 'See Results' }).click();
        }
      }

      await expect(page.getByText('Review Complete!')).toBeVisible();
      await expect(page.getByText('100%')).toBeVisible();
    });

    test('"Conjugation" button navigates to /conjugation', async ({ page }) => {
      await clearProgress(page);
      await seedProgress(page, buildProgressWithStaleVerb());
      await page.goto('/review');
      await page.getByRole('button', { name: 'Start Review' }).click();

      // Answer all questions
      const totalText = await page.getByText(/\d+ \/ \d+/).first().innerText();
      const total = parseInt(totalText.split('/')[1].trim(), 10);

      for (let i = 0; i < total; i++) {
        const infinitive = await page.locator('h2').first().innerText();
        const tenseDisplay = await page.locator('.bg-blue-100').innerText();
        const pronounDisplay = await page
          .locator('.text-xl.text-gray-700 .font-medium')
          .innerText();

        const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);
        await page.getByPlaceholder('Type conjugation...').fill(answer);
        await page.getByRole('button', { name: 'Check' }).click();

        if (i < total - 1) {
          await page.getByRole('button', { name: 'Next Question' }).click();
        } else {
          await page.getByRole('button', { name: 'See Results' }).click();
        }
      }

      await expect(page.getByText('Review Complete!')).toBeVisible();
      await page.getByRole('button', { name: 'Conjugation' }).click();
      await expect(page).toHaveURL(/\/conjugation/);
    });
  });
});
