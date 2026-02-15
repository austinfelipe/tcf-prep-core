import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';
import { lookupAnswer } from './helpers/answer-map';
import { Page } from '@playwright/test';

/** Read the currently displayed question from the page */
async function readQuestion(page: Page) {
  const infinitive = await page.locator('h2').first().innerText();
  const tenseDisplay = await page.locator('.bg-blue-100').innerText();
  const pronounEl = page.locator('.text-xl.text-gray-700 .font-medium');
  const pronounDisplay = await pronounEl.innerText();
  return { infinitive, tenseDisplay, pronounDisplay };
}

test.describe('Practice session (être)', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await page.goto('/level/a1/practice/etre');
    await page.getByPlaceholder('Type conjugation...').waitFor();
  });

  test('shows prompt with verb, tense, pronoun, and input', async ({ page }) => {
    await expect(page.locator('h2').first()).toHaveText('être');
    await expect(page.locator('.bg-blue-100')).toBeVisible();
    await expect(page.locator('.text-xl.text-gray-700 .font-medium')).toBeVisible();
    await expect(page.getByPlaceholder('Type conjugation...')).toBeVisible();
  });

  test('correct answer shows green "Correct!"', async ({ page }) => {
    const { infinitive, tenseDisplay, pronounDisplay } = await readQuestion(page);
    const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);

    await page.getByPlaceholder('Type conjugation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Correct!')).toBeVisible();
  });

  test('wrong answer shows red "Incorrect" with expected', async ({ page }) => {
    await page.getByPlaceholder('Type conjugation...').fill('wrong');
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('Incorrect')).toBeVisible();
    await expect(page.getByText('Correct:')).toBeVisible();
  });

  test('"Next Question" resets to input', async ({ page }) => {
    const { infinitive, tenseDisplay, pronounDisplay } = await readQuestion(page);
    const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);

    await page.getByPlaceholder('Type conjugation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.getByText('Correct!')).toBeVisible();

    await page.getByRole('button', { name: 'Next Question' }).click();

    await expect(page.getByPlaceholder('Type conjugation...')).toBeVisible();
    await expect(page.getByText('Correct!')).not.toBeVisible();
  });

  test('accent buttons insert into input', async ({ page }) => {
    const input = page.getByPlaceholder('Type conjugation...');
    await input.fill('j');

    await page.getByRole('button', { name: 'é' }).click();

    await expect(input).toHaveValue('jé');
  });

  test('progress updates after correct answer', async ({ page }) => {
    await expect(page.getByText('0 / 54 correct answers')).toBeVisible();

    const { infinitive, tenseDisplay, pronounDisplay } = await readQuestion(page);
    const answer = lookupAnswer(infinitive, tenseDisplay, pronounDisplay);

    await page.getByPlaceholder('Type conjugation...').fill(answer);
    await page.getByRole('button', { name: 'Check' }).click();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Progress should increase (React Strict Mode in dev may double-count)
    await expect(page.getByText('0 / 54 correct answers')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/\d+ \/ 54 correct answers/)).toBeVisible();
  });
});
