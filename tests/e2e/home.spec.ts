import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await page.goto('/');
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
});
