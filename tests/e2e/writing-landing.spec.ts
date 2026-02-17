import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';
import {
  clearWritingData,
  seedWritingSession,
  seedEvaluationHistory,
  buildWritingSession,
  buildMockEvaluationResult,
} from './helpers/writing-seed';

test.describe('Writing landing page', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await clearWritingData(page);
  });

  test('home page shows Expression Ecrite card', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Expression Ecrite', exact: true })).toBeVisible();
    await expect(page.getByText('3 tâches · A1–C2')).toBeVisible();
  });

  test('clicking Expression Ecrite card navigates to /writing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Expression Ecrite/ }).click();
    await expect(page).toHaveURL(/\/writing$/);
  });

  test('landing page shows header and 3 task cards', async ({ page }) => {
    await page.goto('/writing');
    await expect(page.getByRole('heading', { name: 'Expression Ecrite — TCF' })).toBeVisible();

    await expect(page.getByText('Message informel')).toBeVisible();
    await expect(page.getByText('Texte fonctionnel')).toBeVisible();
    await expect(page.getByText('Texte argumentatif')).toBeVisible();
  });

  test('task cards show word limits and time', async ({ page }) => {
    await page.goto('/writing');

    await expect(page.getByText('60–120 mots')).toBeVisible();
    await expect(page.getByText('15 minutes')).toBeVisible();
    await expect(page.getByText('120–150 mots')).toBeVisible();
    await expect(page.getByText('20 minutes')).toBeVisible();
    await expect(page.getByText('120–180 mots')).toBeVisible();
    await expect(page.getByText('25 minutes')).toBeVisible();
  });

  test('task cards show CEFR range badges', async ({ page }) => {
    await page.goto('/writing');

    await expect(page.getByText('A1–B1/B2')).toBeVisible();
    await expect(page.getByText('A2–C1')).toBeVisible();
    await expect(page.getByText('B1–C2')).toBeVisible();
  });

  test('"Nouvelle session" button is visible', async ({ page }) => {
    await page.goto('/writing');
    await expect(page.getByRole('button', { name: 'Nouvelle session' })).toBeVisible();
  });

  test('resume button appears when session exists', async ({ page }) => {
    const session = buildWritingSession({ task1Text: 'Bonjour' });
    await seedWritingSession(page, session);
    await page.goto('/writing');

    await expect(page.getByRole('button', { name: 'Reprendre la session en cours' })).toBeVisible();
  });

  test('resume button hidden when no session', async ({ page }) => {
    await page.goto('/writing');
    await expect(page.getByRole('button', { name: 'Reprendre la session en cours' })).not.toBeVisible();
  });

  test('past results shown when history exists', async ({ page }) => {
    const result = buildMockEvaluationResult();
    await seedEvaluationHistory(page, [result]);
    await page.goto('/writing');

    await expect(page.getByText('Résultats précédents')).toBeVisible();
    await expect(page.getByText('12.0/20')).toBeVisible();
  });

  test('clicking "Nouvelle session" navigates to /writing/session', async ({ page }) => {
    await page.goto('/writing');
    await page.getByRole('button', { name: 'Nouvelle session' }).click();
    await expect(page).toHaveURL(/\/writing\/session$/);
  });

  test('back link returns to home', async ({ page }) => {
    await page.goto('/writing');
    await page.getByRole('link', { name: 'Accueil' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
