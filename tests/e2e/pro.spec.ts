import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers/auth';

test.describe('Pro page — non-PRO view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pro');
  });

  test('shows "Go PRO" heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Go PRO' }),
    ).toBeVisible();
  });

  test('shows 4 feature cards', async ({ page }) => {
    await expect(page.getByText('Complete Written Expression')).toBeVisible();
    await expect(page.getByText('AI Evaluation')).toBeVisible();
    await expect(page.getByText('Improved Version')).toBeVisible();
    await expect(page.getByText('Unlimited History')).toBeVisible();
  });

  test('shows subscribe button with price', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /€4\.99\/month/ }),
    ).toBeVisible();
  });

  test('shows "Cancel anytime" text', async ({ page }) => {
    await expect(page.getByText('Cancel anytime')).toBeVisible();
  });

  test('"Home" link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/^\/$/);
  });
});

test.describe('Pro page — PRO view', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page, { isPro: true });
    await page.goto('/pro');
  });

  test('shows "PRO Active" badge', async ({ page }) => {
    await expect(page.getByText('PRO Active')).toBeVisible();
  });

  test('shows "You\'re PRO!" heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: "You're PRO!" }),
    ).toBeVisible();
  });

  test('shows "Access Written Expression" button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Access Written Expression' }),
    ).toBeVisible();
  });

  test('shows "Manage my subscription" button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Manage my subscription' }),
    ).toBeVisible();
  });
});
