import { test, expect } from '@playwright/test';
import { clearProgress } from './helpers/seed';
import {
  clearWritingData,
  buildMockEvaluationResult,
} from './helpers/writing-seed';

test.describe('Writing results page', () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
    await clearWritingData(page);
  });

  test('redirects to /writing when no data', async ({ page }) => {
    await page.goto('/writing/results');
    await expect(page).toHaveURL(/\/writing$/, { timeout: 5000 });
  });

  test('shows loading state then results with mocked API', async ({ page }) => {
    const mockResult = buildMockEvaluationResult('ws-test-123');

    // Mock the /api/evaluate-writing endpoint
    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          result: mockResult,
        }),
      });
    });

    // Seed pending evaluation data (as if user just submitted)
    const pendingData = {
      sessionId: 'ws-test-123',
      tasks: [
        { taskId: 1, prompt: 'Prompt 1', text: 'Texte un' },
        { taskId: 2, prompt: 'Prompt 2', text: 'Texte deux' },
        { taskId: 3, prompt: 'Prompt 3', text: 'Texte trois' },
      ],
    };

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify(pendingData));

    await page.goto('/writing/results');

    // Should show loading spinner briefly
    await expect(page.getByText('Évaluation en cours...')).toBeVisible();

    // After API responds, results should appear
    await expect(page.getByText('12.0 / 20')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Niveau global estimé')).toBeVisible();
  });

  test('displays per-task results with criteria scores', async ({ page }) => {
    const mockResult = buildMockEvaluationResult('ws-test-123');

    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, result: mockResult }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test-123',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');

    // Wait for results to load
    await expect(page.getByText('12.0 / 20')).toBeVisible({ timeout: 10000 });

    // Per-task cards
    await expect(page.getByText('Message informel')).toBeVisible();
    await expect(page.getByText('Texte fonctionnel')).toBeVisible();
    await expect(page.getByText('Texte argumentatif')).toBeVisible();

    // Criteria names should appear in each task card
    await expect(page.getByText('Respect des consignes').first()).toBeVisible();
    await expect(page.getByText('Cohérence et organisation').first()).toBeVisible();

    // Score for each criterion (3/4)
    const scoreThrees = page.getByText('3/4');
    await expect(scoreThrees.first()).toBeVisible();
  });

  test('expanding task details shows grammar analysis', async ({ page }) => {
    const mockResult = buildMockEvaluationResult('ws-test-123');

    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, result: mockResult }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test-123',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');
    await expect(page.getByText('12.0 / 20')).toBeVisible({ timeout: 10000 });

    // Click "Voir les détails" on first task
    await page.getByText('Voir les détails').first().click();

    // Grammar analysis table should appear
    await expect(page.getByText('Analyse grammaticale')).toBeVisible();
    await expect(page.getByText('Accord du participe passé')).toBeVisible();

    // Coherence and lexical analysis
    await expect(page.getByText('Analyse de la cohérence')).toBeVisible();
    await expect(page.getByText('Analyse lexicale')).toBeVisible();
  });

  test('shows strengths and weaknesses', async ({ page }) => {
    const mockResult = buildMockEvaluationResult('ws-test-123');

    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, result: mockResult }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test-123',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');
    await expect(page.getByText('12.0 / 20')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Points forts').first()).toBeVisible();
    await expect(page.getByText('Points faibles').first()).toBeVisible();
    await expect(page.getByText('Registre informel bien respecté')).toBeVisible();
    await expect(page.getByText('Vocabulaire limité')).toBeVisible();
  });

  test('shows error when API fails', async ({ page }) => {
    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: "Erreur lors de l'évaluation. Veuillez réessayer.",
        }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test-err',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');

    await expect(page.getByRole('heading', { name: 'Erreur' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Veuillez réessayer/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retour' })).toBeVisible();
  });

  test('shows rate limit error', async ({ page }) => {
    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Limite de requêtes atteinte. Réessayez dans une heure.',
        }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test-rl',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');

    await expect(page.getByText('Limite de requêtes atteinte')).toBeVisible({ timeout: 10000 });
  });

  test('"Nouvelle session" button clears session and navigates', async ({ page }) => {
    const mockResult = buildMockEvaluationResult();

    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, result: mockResult }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');
    await expect(page.getByText(/\/ 20/)).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Nouvelle session' }).click();
    await expect(page).toHaveURL(/\/writing$/);
  });

  test('results saved to history and visible on landing page', async ({ page }) => {
    const mockResult = buildMockEvaluationResult();

    await page.route('**/api/evaluate-writing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, result: mockResult }),
      });
    });

    await page.addInitScript((data: string) => {
      localStorage.setItem('tcf-writing-pending-evaluation', data);
    }, JSON.stringify({
      sessionId: 'ws-test',
      tasks: [
        { taskId: 1, prompt: 'P1', text: 'T1' },
        { taskId: 2, prompt: 'P2', text: 'T2' },
        { taskId: 3, prompt: 'P3', text: 'T3' },
      ],
    }));

    await page.goto('/writing/results');
    await expect(page.getByText(/\/ 20/)).toBeVisible({ timeout: 10000 });

    // Navigate to landing
    await page.getByRole('button', { name: 'Retour' }).click();
    await expect(page).toHaveURL(/\/writing$/);

    // History should now show the result
    await expect(page.getByText('Résultats précédents')).toBeVisible();
    await expect(page.getByText('12.0/20')).toBeVisible();
  });
});
