import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows hero heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Master French for the TCF Exam' }),
    ).toBeVisible();
  });

  test('"Get Started Free" navigates to /conjugation', async ({ page }) => {
    await page.getByRole('link', { name: 'Get Started Free' }).click();
    await expect(page).toHaveURL(/\/conjugation/);
  });

  test('shows 3 feature cards', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Verb Conjugation' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Written Expression' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Oral Expression' }),
    ).toBeVisible();
  });

  test('shows Free and PRO pricing cards', async ({ page }) => {
    // Free pricing card
    await expect(page.getByText('€0')).toBeVisible();

    // PRO pricing card
    await expect(page.getByText('€4.99')).toBeVisible();
    await expect(page.getByText('/month').first()).toBeVisible();
  });

  test('"Go PRO" link navigates to /pro', async ({ page }) => {
    await page.getByRole('link', { name: 'Go PRO' }).click();
    await expect(page).toHaveURL(/\/pro/);
  });
});
