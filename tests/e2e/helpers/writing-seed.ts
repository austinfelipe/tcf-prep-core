import { Page } from '@playwright/test';

const SESSION_KEY = 'tcf-writing-session';
const HISTORY_KEY = 'tcf-writing-history';

/**
 * Clear all writing-related localStorage keys before page load.
 */
export async function clearWritingData(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('tcf-writing-session');
    localStorage.removeItem('tcf-writing-history');
    localStorage.removeItem('tcf-writing-pending-evaluation');
  });
}

/**
 * Seed a writing session into localStorage before page load.
 */
export async function seedWritingSession(page: Page, session: unknown) {
  const json = JSON.stringify(session);
  await page.addInitScript((data: string) => {
    localStorage.setItem('tcf-writing-session', data);
  }, json);
}

/**
 * Seed evaluation history into localStorage before page load.
 */
export async function seedEvaluationHistory(page: Page, history: unknown) {
  const json = JSON.stringify(history);
  await page.addInitScript((data: string) => {
    localStorage.setItem('tcf-writing-history', data);
  }, json);
}

/**
 * Build a minimal active writing session for testing.
 */
export function buildWritingSession(overrides?: {
  activeTaskId?: number;
  task1Text?: string;
  task2Text?: string;
  task3Text?: string;
  task1TimerStarted?: boolean;
  task1RemainingMs?: number;
  task1TimeExpired?: boolean;
}) {
  const now = Date.now();
  return {
    id: `ws-test-${now}`,
    createdAt: now,
    activeTaskId: overrides?.activeTaskId ?? 1,
    tasks: {
      1: {
        taskId: 1,
        promptIndex: 0,
        text: overrides?.task1Text ?? '',
        timerStarted: overrides?.task1TimerStarted ?? false,
        timerRemainingMs: overrides?.task1RemainingMs ?? 15 * 60 * 1000,
        timerLastTick: null,
        timeExpired: overrides?.task1TimeExpired ?? false,
      },
      2: {
        taskId: 2,
        promptIndex: 0,
        text: overrides?.task2Text ?? '',
        timerStarted: false,
        timerRemainingMs: 20 * 60 * 1000,
        timerLastTick: null,
        timeExpired: false,
      },
      3: {
        taskId: 3,
        promptIndex: 0,
        text: overrides?.task3Text ?? '',
        timerStarted: false,
        timerRemainingMs: 25 * 60 * 1000,
        timerLastTick: null,
        timeExpired: false,
      },
    },
  };
}

/**
 * Build a mock evaluation result for testing.
 */
export function buildMockEvaluationResult(sessionId: string = 'ws-test') {
  const makeCriteria = () => [
    { name: 'Respect des consignes', score: 3, comment: 'Bon respect du format.' },
    { name: 'Cohérence et organisation', score: 2, comment: 'Structure correcte.' },
    { name: 'Étendue du lexique', score: 2, comment: 'Vocabulaire adéquat.' },
    { name: 'Maîtrise de la grammaire', score: 3, comment: 'Bonne maîtrise globale.' },
    { name: 'Orthographe', score: 2, comment: 'Quelques erreurs mineures.' },
  ];

  return {
    sessionId,
    evaluatedAt: Date.now(),
    overallCefrLevel: 'B1',
    overallScore: 12.0,
    tasks: [
      {
        taskId: 1,
        cefrLevel: 'B1',
        score: 12,
        criteria: makeCriteria(),
        strengths: ['Registre informel bien respecté', 'Message clair et compréhensible'],
        weaknesses: ['Vocabulaire limité', 'Quelques erreurs d\'accord'],
        grammarNotes: [
          { excerpt: 'je suis allé', issue: 'Accord du participe passé', correction: 'je suis allée', rule: 'Avec être, le PP s\'accorde avec le sujet' },
        ],
        coherenceAnalysis: 'Le texte est bien organisé avec une introduction et une conclusion.',
        lexicalAnalysis: 'Le vocabulaire est adapté au registre informel.',
      },
      {
        taskId: 2,
        cefrLevel: 'B1',
        score: 12,
        criteria: makeCriteria(),
        strengths: ['Format respecté', 'Ton semi-formel approprié'],
        weaknesses: ['Manque de connecteurs logiques', 'Syntaxe parfois maladroite'],
        grammarNotes: [
          { excerpt: 'les personnes qui vient', issue: 'Conjugaison', correction: 'les personnes qui viennent', rule: 'Accord sujet-verbe au pluriel' },
        ],
        coherenceAnalysis: 'Organisation correcte mais pourrait être améliorée.',
        lexicalAnalysis: 'Vocabulaire fonctionnel adéquat.',
      },
      {
        taskId: 3,
        cefrLevel: 'B1',
        score: 12,
        criteria: makeCriteria(),
        strengths: ['Arguments bien présentés', 'Structure argumentative claire'],
        weaknesses: ['Conclusion trop courte', 'Manque d\'exemples concrets'],
        grammarNotes: [
          { excerpt: 'il faut que on', issue: 'Élision obligatoire', correction: 'il faut qu\'on', rule: 'Élision de "que" devant voyelle' },
        ],
        coherenceAnalysis: 'Texte argumentatif avec une progression logique.',
        lexicalAnalysis: 'Vocabulaire approprié pour un texte formel.',
      },
    ],
  };
}
