import { Page } from '@playwright/test';

const FAKE_USER_ID = '00000000-0000-0000-0000-000000000001';
const FAKE_EMAIL = 'e2e@test.local';

/**
 * Intercept Supabase auth & profile requests so the app sees
 * an authenticated user (optionally with PRO status).
 *
 * Must be called **before** navigating to the page.
 */
export async function mockAuthenticatedUser(
  page: Page,
  options: { isPro?: boolean } = {},
) {
  const isPro = options.isPro ?? false;

  // Intercept GET /auth/v1/user → fake authenticated user
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: FAKE_USER_ID,
        aud: 'authenticated',
        role: 'authenticated',
        email: FAKE_EMAIL,
        email_confirmed_at: '2025-01-01T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {},
        identities: [],
      }),
    });
  });

  // Intercept GET /rest/v1/profiles → fake profile
  await page.route('**/rest/v1/profiles*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: FAKE_USER_ID,
        email: FAKE_EMAIL,
        is_pro: isPro,
        pro_until: isPro ? '2099-12-31T00:00:00Z' : null,
        stripe_customer_id: isPro ? 'cus_fake' : null,
        stripe_subscription_id: isPro ? 'sub_fake' : null,
      }),
    });
  });
}
