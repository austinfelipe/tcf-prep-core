import { test, expect } from '@playwright/test';
import {
  clearProgress,
  seedProgress,
  buildStaleVerbProgress,
  PROGRESS_VERSION,
  A1_TENSES,
  ALL_PRONOUNS,
} from './helpers/seed';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await page.goto('/conjugation');
  });

  test('page loads with header "TCF Prep"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TCF Prep' })).toBeVisible();
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

    const a1Link = page.locator('a[href="/level/a1"]');
    await expect(a1Link).toBeVisible();
    await expect(a1Link).not.toHaveClass(/pointer-events-none/);
  });

  test('clicking A1 navigates to /level/a1', async ({ page }) => {
    await page.locator('a[href="/level/a1"]').click();
    await expect(page).toHaveURL(/\/level\/a1/);
  });

  test('Reset Progress button visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Reset Progress' }),
    ).toBeVisible();
  });

  test('shows review section with due count when stale progress exists', async ({ page }) => {
    // Create a fresh page context with stale progress seeded
    await seedProgress(page, {
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
    });
    await page.goto('/conjugation');

    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
    await expect(page.getByText(/1 verb.* due/)).toBeVisible();
  });
});
