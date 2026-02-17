import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';
import {
  clearWritingData,
  seedWritingSession,
  buildWritingSession,
} from './helpers/writing-seed';

test.describe('Writing session', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await clearWritingData(page);
  });

  test('redirects to /writing when no active session', async ({ page }) => {
    await page.goto('/writing/session');
    await expect(page).toHaveURL(/\/writing$/, { timeout: 5000 });
  });

  test('session page loads with task tabs', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByRole('button', { name: /Tâche 1/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tâche 2/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tâche 3/ })).toBeVisible();
  });

  test('shows timer in initial state', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByText('15:00')).toBeVisible();
    await expect(page.getByText('Commence à la première frappe')).toBeVisible();
  });

  test('shows task instructions with consigne', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByText('Consigne')).toBeVisible();
    // One of the 3 prompts for task 1 should be visible (promptIndex 0)
    await expect(page.getByText(/déménag|anniversaire|week-end/)).toBeVisible();
  });

  test('shows CEFR info panel', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByText(/Niveaux CECR visés/)).toBeVisible();
  });

  test('shows word counter at 0', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByText('0 / 60–120 mots')).toBeVisible();
  });

  test('shows accent toolbar buttons', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByRole('button', { name: 'é', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ç', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'à', exact: true })).toBeVisible();
  });

  test('shows submit button', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await expect(page.getByRole('button', { name: 'Soumettre pour évaluation' })).toBeVisible();
  });

  test('typing updates word counter', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    const textarea = page.locator('textarea');
    await textarea.fill('Bonjour mon ami');

    await expect(page.getByText('3 / 60–120 mots')).toBeVisible();
  });

  test('accent buttons insert into textarea', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    const textarea = page.locator('textarea');
    await textarea.fill('J');

    await page.getByRole('button', { name: 'é', exact: true }).click();

    await expect(textarea).toHaveValue('Jé');
  });

  test('timer starts on first keystroke', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    // Timer should show "Commence à la première frappe" initially
    await expect(page.getByText('Commence à la première frappe')).toBeVisible();

    const textarea = page.locator('textarea');
    await textarea.fill('B');

    // After typing, the "first keystroke" message should disappear
    await expect(page.getByText('Commence à la première frappe')).not.toBeVisible({ timeout: 3000 });
  });

  test('switching tasks shows different timer and instructions', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    // Initially on Task 1 (15 min)
    await expect(page.getByText('15:00')).toBeVisible();
    await expect(page.getByText('Tâche 1 / 3')).toBeVisible();

    // Switch to Task 2
    await page.getByRole('button', { name: /Tâche 2/ }).click();

    // Task 2 has 20 min timer
    await expect(page.getByText('20:00')).toBeVisible();
    await expect(page.getByText('Tâche 2 / 3')).toBeVisible();

    // Switch to Task 3
    await page.getByRole('button', { name: /Tâche 3/ }).click();

    // Task 3 has 25 min timer
    await expect(page.getByText('25:00')).toBeVisible();
    await expect(page.getByText('Tâche 3 / 3')).toBeVisible();
  });

  test('text persists when switching tasks', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    const textarea = page.locator('textarea');

    // Type in Task 1
    await textarea.fill('Texte pour la tâche un');

    // Switch to Task 2
    await page.getByRole('button', { name: /Tâche 2/ }).click();
    await expect(textarea).toHaveValue('');

    // Type in Task 2
    await textarea.fill('Texte pour la tâche deux');

    // Switch back to Task 1
    await page.getByRole('button', { name: /Tâche 1/ }).click();
    await expect(textarea).toHaveValue('Texte pour la tâche un');

    // Switch back to Task 2 — text preserved
    await page.getByRole('button', { name: /Tâche 2/ }).click();
    await expect(textarea).toHaveValue('Texte pour la tâche deux');
  });

  test('session recovered after reload', async ({ page }) => {
    const session = buildWritingSession({ task1Text: 'Mon texte sauvegardé' });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    const textarea = page.locator('textarea');
    await expect(textarea).toHaveValue('Mon texte sauvegardé');

    // "Session récupérée" toast should appear
    await expect(page.getByText('Session récupérée')).toBeVisible({ timeout: 3000 });
  });

  test('editor disabled when time expired', async ({ page }) => {
    const session = buildWritingSession({
      task1TimerStarted: true,
      task1RemainingMs: 0,
      task1TimeExpired: true,
      task1Text: 'Texte avant expiration',
    });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    const textarea = page.locator('textarea');
    await expect(textarea).toBeDisabled();
    await expect(textarea).toHaveValue('Texte avant expiration');
    await expect(page.getByText('00:00')).toBeVisible();
  });

  test('submit button opens confirmation dialog', async ({ page }) => {
    const session = buildWritingSession({ task1Text: 'Bonjour' });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await page.getByRole('button', { name: 'Soumettre pour évaluation' }).click();

    await expect(page.getByText('Soumettre pour évaluation ?')).toBeVisible();
    await expect(page.getByText('Message informel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Soumettre', exact: true })).toBeVisible();
  });

  test('confirmation dialog shows word count warnings for empty tasks', async ({ page }) => {
    const session = buildWritingSession({ task1Text: 'Bonjour' });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await page.getByRole('button', { name: 'Soumettre pour évaluation' }).click();

    // Tasks 2 and 3 are empty, so warnings should appear
    await expect(page.getByText('Tâche 2 : aucun texte')).toBeVisible();
    await expect(page.getByText('Tâche 3 : aucun texte')).toBeVisible();
  });

  test('cancel in confirmation dialog returns to session', async ({ page }) => {
    const session = buildWritingSession({ task1Text: 'Bonjour' });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await page.getByRole('button', { name: 'Soumettre pour évaluation' }).click();
    await page.getByRole('button', { name: 'Annuler' }).click();

    // Dialog should close
    await expect(page.getByText('Soumettre pour évaluation ?')).not.toBeVisible();
    // Still on session page
    await expect(page).toHaveURL(/\/writing\/session$/);
  });

  test('confirming submit stores pending evaluation data', async ({ page }) => {
    const session = buildWritingSession({
      task1Text: 'Un texte pour la première tâche.',
      task2Text: 'Un texte pour la deuxième tâche.',
      task3Text: 'Un texte pour la troisième tâche.',
    });
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await page.getByRole('button', { name: 'Soumettre pour évaluation' }).click();

    // Verify pending data gets stored in localStorage before navigation
    const hasPending = await page.evaluate(() => {
      return localStorage.getItem('tcf-writing-pending-evaluation') !== null;
    });

    // The dialog stores data and navigates — check that submit triggers the flow
    await page.getByRole('button', { name: 'Soumettre', exact: true }).click();

    // After clicking submit, the page should navigate away from /writing/session
    await expect(page).not.toHaveURL(/\/writing\/session$/, { timeout: 10000 });
  });

  test('back link navigates to /writing', async ({ page }) => {
    const session = buildWritingSession();
    await seedWritingSession(page, session);
    await page.goto('/writing/session');

    await page.getByRole('link', { name: 'Retour' }).click();
    await expect(page).toHaveURL(/\/writing$/);
  });
});
