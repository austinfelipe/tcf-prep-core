import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';

test.describe('Level tree (A1)', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await page.goto('/level/a1');
  });

  test('first verb (être) is clickable', async ({ page }) => {
    // VerbNode wraps absolutely-positioned content in <a>, so the link
    // itself has no intrinsic dimensions. Check the link exists via href.
    const etreLink = page.locator('a[href="/level/a1/practice/etre"]');
    await expect(etreLink).toHaveCount(1);
  });

  test('second verb (avoir) is locked', async ({ page }) => {
    await expect(page.locator('a[href="/level/a1/practice/avoir"]')).toHaveCount(0);
  });

  test('clicking être navigates to practice', async ({ page }) => {
    await page.locator('a[href="/level/a1/practice/etre"]').click({ force: true });
    await expect(page).toHaveURL(/\/level\/a1\/practice\/etre/);
  });

  test('back link returns to home', async ({ page }) => {
    await page.getByRole('link', { name: 'Levels' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('progress shows 0%', async ({ page }) => {
    await expect(page.getByText('0%')).toBeVisible();
  });
});
