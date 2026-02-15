import { test, expect } from '@playwright/test';
import {
  seedProgress,
  buildAllA1Dominated,
} from './helpers/seed';
import { lookupAnswer } from './helpers/answer-map';
import { Page } from '@playwright/test';

async function readTestQuestion(page: Page) {
  const infinitive = await page.locator('h2').first().innerText();
  const tenseDisplay = await page.locator('.bg-blue-100').innerText();
  const pronounEl = page.locator('.text-xl.text-gray-700 .font-medium');
  const pronounDisplay = await pronounEl.innerText();
  return { infinitive, tenseDisplay, pronounDisplay };
}

test.describe('Level test (A1)', () => {
  test('"Take Level Test" CTA visible when all verbs dominated', async ({ page }) => {
    await seedProgress(page, buildAllA1Dominated());
    await page.goto('/level/a1');

    await expect(page.getByText('All verbs dominated!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Take Level Test' })).toBeVisible();
  });

  test('start test shows question format', async ({ page }) => {
    await seedProgress(page, buildAllA1Dominated());
    await page.goto('/level/a1/test');

    await expect(page.getByRole('heading', { name: 'A1 Level Test' })).toBeVisible();
    await expect(page.getByText('40 questions')).toBeVisible();
    await expect(page.getByText('80%')).toBeVisible();

    await page.getByRole('button', { name: 'Start Test' }).click();

    await expect(page.getByText('Question 1 of 40')).toBeVisible();
    await expect(page.getByPlaceholder('Type conjugation...')).toBeVisible();
  });

  test('pass test → A2 unlocked', async ({ page }) => {
    await seedProgress(page, buildAllA1Dominated());
    await page.goto('/level/a1/test');
    await page.getByRole('button', { name: 'Start Test' }).click();

    // Answer all 40 questions
    for (let i = 1; i <= 40; i++) {
      await page.getByPlaceholder('Type conjugation...').waitFor();
      await expect(page.getByText(`Question ${i} of 40`)).toBeVisible();

      const { infinitive, tenseDisplay, pronounDisplay } = await readTestQuestion(page);
      const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);

      await page.getByPlaceholder('Type conjugation...').fill(answer);
      await page.getByRole('button', { name: 'Check' }).click();
    }

    // Should show pass result
    await expect(page.getByText('Congratulations! You passed!')).toBeVisible();

    // Verify A2 is unlocked by checking localStorage directly
    // (page.goto would re-run addInitScript, overwriting the progress)
    const a2Unlocked = await page.evaluate(() => {
      const raw = localStorage.getItem('tcf-prep-progress');
      if (!raw) return false;
      const progress = JSON.parse(raw);
      return progress.levels.a2.unlocked === true;
    });
    expect(a2Unlocked).toBe(true);
  });
});
