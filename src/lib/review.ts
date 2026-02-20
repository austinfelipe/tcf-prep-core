import { VerbEntry, Tense } from '@/types/conjugation';
import { LevelId } from '@/types/level';
import { UserProgress } from '@/types/progress';
import { LEVELS } from '@/data/levels';
import { getVerbById } from '@/data/conjugations';

const REVIEW_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 hours

export interface ReviewItem {
  levelId: LevelId;
  verbId: string;
  verb: VerbEntry;
  comboKey: string;
  tense: Tense;
  pronoun: string;
  acceptedAnswers: string[];
  lastPracticed: number;
  staleness: number;
}

export interface ReviewSummary {
  dueVerbCount: number;
  totalPracticedVerbs: number;
  oldestStalenessMs: number;
}

export function collectReviewItems(progress: UserProgress): ReviewItem[] {
  const now = Date.now();
  const items: ReviewItem[] = [];

  for (const level of LEVELS) {
    const levelProgress = progress.levels[level.id];
    if (!levelProgress) continue;

    for (const [verbId, verbMastery] of Object.entries(levelProgress.verbMastery)) {
      const verb = getVerbById(verbId);
      if (!verb) continue;

      for (const [comboKey, combo] of Object.entries(verbMastery)) {
        if (combo.totalAttempts === 0) continue;

        const [tense, pronoun] = comboKey.split(':') as [Tense, string];
        const answers = verb.conjugations[tense]?.[pronoun];
        if (!answers) continue;

        const staleness = now - combo.lastPracticed;
        if (staleness < REVIEW_THRESHOLD_MS) continue;

        items.push({
          levelId: level.id,
          verbId,
          verb,
          comboKey,
          tense,
          pronoun,
          acceptedAnswers: answers,
          lastPracticed: combo.lastPracticed,
          staleness,
        });
      }
    }
  }

  // Sort: verb staleness desc, then combo weakness (fewer correct = higher priority)
  items.sort((a, b) => {
    if (b.staleness !== a.staleness) return b.staleness - a.staleness;
    const aCorrect = progress.levels[a.levelId].verbMastery[a.verbId]?.[a.comboKey]?.correctCount ?? 0;
    const bCorrect = progress.levels[b.levelId].verbMastery[b.verbId]?.[b.comboKey]?.correctCount ?? 0;
    return aCorrect - bCorrect;
  });

  return items;
}

export function selectReviewSession(items: ReviewItem[], size = 20): ReviewItem[] {
  if (items.length === 0) return [];

  const uniqueVerbs = new Set(items.map((i) => i.verbId)).size;
  const cap = Math.ceil(size / uniqueVerbs) + 1;

  // Apply diversity cap per verb
  const verbCounts = new Map<string, number>();
  const selected: ReviewItem[] = [];

  for (const item of items) {
    const count = verbCounts.get(item.verbId) ?? 0;
    if (count >= cap) continue;
    verbCounts.set(item.verbId, count + 1);
    selected.push(item);
    if (selected.length >= size) break;
  }

  // Shuffle for varied presentation
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

export function getReviewSummary(progress: UserProgress): ReviewSummary {
  const now = Date.now();
  let dueVerbCount = 0;
  let totalPracticedVerbs = 0;
  let oldestStalenessMs = 0;

  for (const level of LEVELS) {
    const levelProgress = progress.levels[level.id];
    if (!levelProgress) continue;

    for (const [, verbMastery] of Object.entries(levelProgress.verbMastery)) {
      let hasPracticed = false;
      let hasDueCombo = false;

      for (const [, combo] of Object.entries(verbMastery)) {
        if (combo.totalAttempts === 0) continue;
        hasPracticed = true;

        const staleness = now - combo.lastPracticed;
        if (staleness >= REVIEW_THRESHOLD_MS) {
          hasDueCombo = true;
          if (staleness > oldestStalenessMs) {
            oldestStalenessMs = staleness;
          }
        }
      }

      if (!hasPracticed) continue;
      totalPracticedVerbs++;

      if (hasDueCombo) {
        dueVerbCount++;
      }
    }
  }

  return { dueVerbCount, totalPracticedVerbs, oldestStalenessMs };
}

export function formatStaleness(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`;

  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''}`;
}
