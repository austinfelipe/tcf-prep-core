import { test, expect } from '@playwright/test';
import {
  clearTranslationProgress,
  seedTranslationProgress,
  TRANSLATION_PROGRESS_VERSION,
  A1_PHRASE_IDS,
  buildMasteredPhrase,
  buildAllA1Mastered,
} from './helpers/translation-seed';
import { lookupTranslation } from './helpers/translation-answer-map';

test.describe('Translation hub page', () => {
  test.beforeEach(async ({ page }) => {
    await clearTranslationProgress(page);
    await page.goto('/translation');
  });

  test('page loads with "Translation" heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Translation' }),
    ).toBeVisible();
  });

  test('shows all 4 level cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'A1' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'A2' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'B1' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'B2' })).toBeVisible();
  });

  test('A1 unlocked, A2/B1/B2 locked', async ({ page }) => {
    const lockedBadges = page.getByText('Locked');
    await expect(lockedBadges).toHaveCount(3);

    const a1Link = page.locator('a[href="/translation/a1"]');
    await expect(a1Link).toBeVisible();
    await expect(a1Link).not.toHaveClass(/pointer-events-none/);
  });

  test('clicking A1 navigates to /translation/a1', async ({ page }) => {
    await page.locator('a[href="/translation/a1"]').click();
    await expect(page).toHaveURL(/\/translation\/a1/);
  });

  test('Reset Progress button visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Reset Progress' }),
    ).toBeVisible();
  });
});

test.describe('Translation practice session', () => {
  test.beforeEach(async ({ page }) => {
    await clearTranslationProgress(page);
    await page.goto('/translation/a1');
    await page.getByPlaceholder('Type translation...').waitFor();
  });

  test('shows English phrase prompt and input', async ({ page }) => {
    await expect(page.getByText('Translate to French')).toBeVisible();
    await expect(page.getByPlaceholder('Type translation...')).toBeVisible();
  });

  test('correct answer shows green "Correct!"', async ({ page }) => {
    const english = await page.locator('.text-xl.font-medium').innerText();
    const answer = lookupTranslation(english);

    await page.getByPlaceholder('Type translation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
  });

  test('wrong answer shows red "Incorrect" with expected', async ({ page }) => {
    await page.getByPlaceholder('Type translation...').fill('wrong');
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Incorrect')).toBeVisible();
    await expect(page.getByText('Correct:')).toBeVisible();
  });

  test('"Next Question" resets to input with new phrase', async ({ page }) => {
    const english = await page.locator('.text-xl.font-medium').innerText();
    const answer = lookupTranslation(english);

    await page.getByPlaceholder('Type translation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.getByText('Correct!')).toBeVisible();

    await page.getByRole('button', { name: 'Next Question' }).click();

    await expect(page.getByPlaceholder('Type translation...')).toBeVisible();
    await expect(page.getByText('Correct!')).not.toBeVisible();
  });

  test('progress counter updates after correct answer', async ({ page }) => {
    await expect(page.getByText('0 / 60 correct answers')).toBeVisible();

    const english = await page.locator('.text-xl.font-medium').innerText();
    const answer = lookupTranslation(english);

    await page.getByPlaceholder('Type translation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await page.getByRole('button', { name: 'Next Question' }).click();

    await expect(page.getByText('0 / 60 correct answers')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/\d+ \/ 60 correct answers/)).toBeVisible();
  });
});

test.describe('Translation mastery & level unlock', () => {
  test('near-mastered level shows "Level complete!" after final correct answer', async ({ page }) => {
    // Seed A1 with 19/20 phrases mastered, last phrase at correctCount: 2
    const phraseMastery: Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }> = {};
    for (const id of A1_PHRASE_IDS) {
      if (id === 'a1-20') {
        phraseMastery[id] = { correctCount: 2, totalAttempts: 2, lastPracticed: Date.now() };
      } else {
        phraseMastery[id] = buildMasteredPhrase();
      }
    }

    await seedTranslationProgress(page, {
      version: TRANSLATION_PROGRESS_VERSION,
      levels: {
        a1: { unlocked: true, phraseMastery },
        a2: { unlocked: false, phraseMastery: {} },
        b1: { unlocked: false, phraseMastery: {} },
        b2: { unlocked: false, phraseMastery: {} },
      },
    });

    await page.goto('/translation/a1');
    await page.getByPlaceholder('Type translation...').waitFor();

    // Should be Good evening! → "Bonsoir !" (a1-20 is the unmastered phrase)
    const english = await page.locator('.text-xl.font-medium').innerText();
    const answer = lookupTranslation(english);

    await page.getByPlaceholder('Type translation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
    await expect(page.getByText('Level complete!')).toBeVisible();
  });

  test('A1 all mastered → A2 unlocked on hub', async ({ page }) => {
    await seedTranslationProgress(page, buildAllA1Mastered());
    await page.goto('/translation');

    // A2 should be unlocked (no "Locked" badge for A2)
    // Only B1 and B2 should be locked
    const lockedBadges = page.getByText('Locked');
    await expect(lockedBadges).toHaveCount(2);
  });
});
