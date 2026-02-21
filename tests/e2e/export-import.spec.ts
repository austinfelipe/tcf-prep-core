import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  seedProgress,
  clearProgress,
  PROGRESS_VERSION,
  buildFullVerbMastery,
  A1_TENSES,
  ALL_PRONOUNS,
} from './helpers/seed';

function buildProgressWithEtre() {
  return {
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
}

test.describe('Export / Import progress', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
  });

  test('Export and Import buttons are visible', async ({ page }) => {
    await page.goto('/conjugation');
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
  });

  test('Export downloads a JSON file with progress data', async ({ page }) => {
    const progress = buildProgressWithEtre();
    await seedProgress(page, progress);
    await page.goto('/conjugation');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('tcf-prep-progress.json');

    const filePath = await download.path();
    expect(filePath).toBeTruthy();
    const contents = fs.readFileSync(filePath!, 'utf-8');
    const parsed = JSON.parse(contents);

    expect(parsed.version).toBe(PROGRESS_VERSION);
    expect(parsed.levels.a1.verbMastery.etre).toBeDefined();
  });

  test('Import restores progress from exported file', async ({ page }) => {
    const progress = buildProgressWithEtre();
    await seedProgress(page, progress);
    await page.goto('/conjugation');

    // A1 percentage is in the first level card
    const a1Percent = page.getByRole('link', { name: /A1/ }).locator('.text-2xl');

    // Verify A1 starts with non-zero progress
    await expect(a1Percent).not.toHaveText('0%');

    // Export first
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export' }).click();
    const download = await downloadPromise;
    const exportedPath = await download.path();
    expect(exportedPath).toBeTruthy();

    // Reset progress — accept the confirm dialog
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Reset Progress' }).click();

    // Verify A1 is now at 0%
    await expect(a1Percent).toHaveText('0%');

    // Import the exported file — accept the confirm dialog
    const importDialogPromise = page.waitForEvent('dialog');
    const fileInput = page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(exportedPath!);
    const importDialog = await importDialogPromise;
    await importDialog.accept();

    // Verify A1 progress is restored (no longer 0%)
    await expect(a1Percent).not.toHaveText('0%', { timeout: 5000 });
  });

  test('Import rejects invalid JSON file', async ({ page }) => {
    await page.goto('/conjugation');

    // Create a temp file with invalid JSON
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    const invalidFilePath = path.join(tmpDir, 'invalid-progress.json');
    fs.writeFileSync(invalidFilePath, 'not valid json{{{');

    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const fileInput = page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(invalidFilePath);

    // Wait for the alert to fire
    await page.waitForTimeout(500);
    expect(alertMessage).toContain('not valid JSON');

    // Clean up
    fs.rmSync(tmpDir, { recursive: true });
  });
});
