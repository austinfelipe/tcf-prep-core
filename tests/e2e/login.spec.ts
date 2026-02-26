import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows "Welcome to TCF Prep" heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Welcome to TCF Prep' }),
    ).toBeVisible();
  });

  test('shows sign-in subtext', async ({ page }) => {
    await expect(
      page.getByText('Sign in to access PRO features'),
    ).toBeVisible();
  });

  test('"Home" link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/^\/$/);
  });

  test('real login flow with env credentials', async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;
    test.skip(!email || !password, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set');

    await page.getByLabel('Email address').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
