import { test, expect } from '@playwright/test';
import {
  clearAdverbProgress,
  seedAdverbProgress,
  ADVERB_PROGRESS_VERSION,
  A1_ADJECTIVE_IDS,
  buildMasteredCombo,
  buildFullAdjectiveMastery,
  buildAllA1Mastered,
} from './helpers/adverb-seed';
import { lookupAdverbAnswer } from './helpers/adverb-answer-map';

test.describe('Adverb hub page', () => {
  test.beforeEach(async ({ page }) => {
    await clearAdverbProgress(page);
    await page.goto('/adverb');
  });

  test('page loads with "Adjectives" heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Adjectives' }),
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

    const a1Link = page.locator('a[href="/adverb/a1"]');
    await expect(a1Link).toBeVisible();
    await expect(a1Link).not.toHaveClass(/pointer-events-none/);
  });

  test('clicking A1 navigates to /adverb/a1', async ({ page }) => {
    await page.locator('a[href="/adverb/a1"]').click();
    await expect(page).toHaveURL(/\/adverb\/a1/);
  });

  test('Reset Progress button visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Reset Progress' }),
    ).toBeVisible();
  });
});

test.describe('Adverb practice session', () => {
  test.beforeEach(async ({ page }) => {
    await clearAdverbProgress(page);
    await page.goto('/adverb/a1');
    await page.locator('input[placeholder]').waitFor();
  });

  test('shows masculine adjective prompt with combo badge and input', async ({ page }) => {
    const comboBadge = page.locator('text=/Féminin|Adverbe/');
    await expect(comboBadge).toBeVisible();
    await expect(page.locator('input[placeholder]')).toBeVisible();
  });

  test('correct answer shows green "Correct!"', async ({ page }) => {
    const masculine = await page.locator('.text-2xl.font-bold.text-gray-900').innerText();
    const comboBadgeText = await page.locator('text=/Féminin|Adverbe/').innerText();
    const combo = comboBadgeText === 'Féminin' ? 'féminin' : 'adverbe';
    const answer = lookupAdverbAnswer(masculine, combo as 'féminin' | 'adverbe');

    await page.locator('input[placeholder]').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
  });

  test('wrong answer shows red "Incorrect" with expected', async ({ page }) => {
    await page.locator('input[placeholder]').fill('wrong');
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Incorrect')).toBeVisible();
    await expect(page.getByText('Correct:')).toBeVisible();
  });

  test('"Next Question" resets to input with new prompt', async ({ page }) => {
    const masculine = await page.locator('.text-2xl.font-bold.text-gray-900').innerText();
    const comboBadgeText = await page.locator('text=/Féminin|Adverbe/').innerText();
    const combo = comboBadgeText === 'Féminin' ? 'féminin' : 'adverbe';
    const answer = lookupAdverbAnswer(masculine, combo as 'féminin' | 'adverbe');

    await page.locator('input[placeholder]').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.getByText('Correct!')).toBeVisible();

    await page.getByRole('button', { name: 'Next Question' }).click();

    await expect(page.locator('input[placeholder]')).toBeVisible();
    await expect(page.getByText('Correct!')).not.toBeVisible();
  });

  test('progress counter updates after correct answer', async ({ page }) => {
    // A1 has 30 adjectives, 28 with 2 combos + 2 with 1 combo = 58 combos → 174 needed
    await expect(page.getByText(/0 \/ \d+ correct answers/)).toBeVisible();

    const masculine = await page.locator('.text-2xl.font-bold.text-gray-900').innerText();
    const comboBadgeText = await page.locator('text=/Féminin|Adverbe/').innerText();
    const combo = comboBadgeText === 'Féminin' ? 'féminin' : 'adverbe';
    const answer = lookupAdverbAnswer(masculine, combo as 'féminin' | 'adverbe');

    await page.locator('input[placeholder]').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await page.getByRole('button', { name: 'Next Question' }).click();

    await expect(page.getByText(/0 \/ \d+ correct answers/)).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/\d+ \/ \d+ correct answers/)).toBeVisible();
  });
});

test.describe('Adverb mastery & level unlock', () => {
  test('near-mastered level shows "Level complete!" after final correct answer', async ({ page }) => {
    // Seed A1 with all but one combo mastered; last adjective has féminin at correctCount: 2
    const adjectiveMastery: Record<string, Record<string, { correctCount: number; totalAttempts: number; lastPracticed: number }>> = {};

    for (const id of A1_ADJECTIVE_IDS) {
      if (id === 'a1-autre') {
        // Leave féminin at 2/2 (one more correct needed), adverbe mastered
        adjectiveMastery[id] = {
          'féminin': { correctCount: 2, totalAttempts: 2, lastPracticed: Date.now() },
          'adverbe': buildMasteredCombo(),
        };
      } else {
        adjectiveMastery[id] = buildFullAdjectiveMastery(id);
      }
    }

    await seedAdverbProgress(page, {
      version: ADVERB_PROGRESS_VERSION,
      levels: {
        a1: { unlocked: true, adjectiveMastery },
        a2: { unlocked: false, adjectiveMastery: {} },
        b1: { unlocked: false, adjectiveMastery: {} },
        b2: { unlocked: false, adjectiveMastery: {} },
      },
    });

    await page.goto('/adverb/a1');
    await page.locator('input[placeholder]').waitFor();

    // The unmastered combo should be selected (autre → féminin)
    const masculine = await page.locator('.text-2xl.font-bold.text-gray-900').innerText();
    const comboBadgeText = await page.locator('text=/Féminin|Adverbe/').innerText();
    const combo = comboBadgeText === 'Féminin' ? 'féminin' : 'adverbe';
    const answer = lookupAdverbAnswer(masculine, combo as 'féminin' | 'adverbe');

    await page.locator('input[placeholder]').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
    await expect(page.getByText('Level complete!')).toBeVisible();
  });

  test('A1 all mastered → A2 unlocked on hub', async ({ page }) => {
    await seedAdverbProgress(page, buildAllA1Mastered());
    await page.goto('/adverb');

    // A2 should be unlocked (no "Locked" badge for A2)
    // Only B1 and B2 should be locked
    const lockedBadges = page.getByText('Locked');
    await expect(lockedBadges).toHaveCount(2);
  });
});
