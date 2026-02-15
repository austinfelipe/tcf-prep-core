import { VerbEntry, Tense } from '@/types/conjugation';
import { LevelDefinition } from '@/types/level';
import { ALL_PRONOUNS, IMPERATIVE_PRONOUNS } from '@/data/pronouns';

export interface TestQuestion {
  verbId: string;
  infinitive: string;
  tense: Tense;
  pronoun: string;
  acceptedAnswers: string[];
}

export function generateTestQuestions(
  level: LevelDefinition,
  verbs: VerbEntry[]
): TestQuestion[] {
  const pool: TestQuestion[] = [];

  // Build full pool of all possible questions
  for (const verb of verbs) {
    for (const tense of level.tenses) {
      if (!(tense in verb.conjugations)) continue;
      const pronouns = tense === 'impératif' ? IMPERATIVE_PRONOUNS : ALL_PRONOUNS;
      for (const pronoun of pronouns) {
        if (verb.conjugations[tense]?.[pronoun]) {
          pool.push({
            verbId: verb.id,
            infinitive: verb.infinitive,
            tense,
            pronoun,
            acceptedAnswers: verb.conjugations[tense][pronoun],
          });
        }
      }
    }
  }

  const count = level.testQuestionCount;
  const selected: TestQuestion[] = [];

  // Step 1: Ensure at least one question per tense
  for (const tense of level.tenses) {
    const tensePool = pool.filter((q) => q.tense === tense);
    if (tensePool.length > 0) {
      const pick = tensePool[Math.floor(Math.random() * tensePool.length)];
      selected.push(pick);
    }
  }

  // Step 2: Fill remaining slots with diversity constraints
  const maxPerVerb = Math.ceil(count / verbs.length) + 1;
  const verbCounts: Record<string, number> = {};
  for (const q of selected) {
    verbCounts[q.verbId] = (verbCounts[q.verbId] ?? 0) + 1;
  }

  // Shuffle the remaining pool
  const remaining = pool
    .filter(
      (q) =>
        !selected.some(
          (s) =>
            s.verbId === q.verbId &&
            s.tense === q.tense &&
            s.pronoun === q.pronoun
        )
    )
    .sort(() => Math.random() - 0.5);

  for (const q of remaining) {
    if (selected.length >= count) break;
    const currentCount = verbCounts[q.verbId] ?? 0;
    if (currentCount >= maxPerVerb) continue;
    selected.push(q);
    verbCounts[q.verbId] = currentCount + 1;
  }

  // If still not enough, add from remaining without constraints
  if (selected.length < count) {
    const extras = pool
      .filter(
        (q) =>
          !selected.some(
            (s) =>
              s.verbId === q.verbId &&
              s.tense === q.tense &&
              s.pronoun === q.pronoun
          )
      )
      .sort(() => Math.random() - 0.5);

    for (const q of extras) {
      if (selected.length >= count) break;
      selected.push(q);
    }
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
}
