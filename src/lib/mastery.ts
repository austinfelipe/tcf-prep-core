import { VerbEntry, Tense } from "@/types/conjugation";
import { ComboMastery, VerbMasteryData, LevelProgress } from "@/types/progress";
import { ALL_PRONOUNS, IMPERATIVE_PRONOUNS } from "@/data/pronouns";

const MASTERY_CORRECT_THRESHOLD = 3;
const MASTERY_ACCURACY_THRESHOLD = 0.66;

export function isComboMastered(combo: ComboMastery | undefined): boolean {
  if (!combo) return false;
  if (combo.correctCount < MASTERY_CORRECT_THRESHOLD) return false;
  if (combo.totalAttempts === 0) return false;
  return combo.correctCount / combo.totalAttempts >= MASTERY_ACCURACY_THRESHOLD;
}

export function getCombosForVerb(verb: VerbEntry, tenses: Tense[]): string[] {
  const combos: string[] = [];
  for (const tense of tenses) {
    if (!(tense in verb.conjugations)) continue;
    const pronouns = tense === "impératif" ? IMPERATIVE_PRONOUNS : ALL_PRONOUNS;
    for (const pronoun of pronouns) {
      if (verb.conjugations[tense]?.[pronoun]) {
        combos.push(`${tense}:${pronoun}`);
      }
    }
  }
  return combos;
}

export function isVerbDominated(
  verbMastery: VerbMasteryData | undefined,
  verb: VerbEntry,
  tenses: Tense[],
): boolean {
  if (!verbMastery) return false;
  const combos = getCombosForVerb(verb, tenses);
  return combos.every((combo) => isComboMastered(verbMastery[combo]));
}

export function getVerbProgress(
  verbMastery: VerbMasteryData | undefined,
  verb: VerbEntry,
  tenses: Tense[],
): { mastered: number; total: number } {
  const combos = getCombosForVerb(verb, tenses);
  const mastered = combos.filter((combo) =>
    isComboMastered(verbMastery?.[combo]),
  ).length;
  return { mastered, total: combos.length };
}

export function getLevelCompletionPercent(
  levelProgress: LevelProgress,
  verbs: VerbEntry[],
  tenses: Tense[],
): number {
  let totalMastered = 0;
  let totalCombos = 0;

  for (const verb of verbs) {
    const progress = getVerbProgress(
      levelProgress.verbMastery[verb.id],
      verb,
      tenses,
    );
    totalMastered += progress.mastered;
    totalCombos += progress.total;
  }

  if (totalCombos === 0) return 0;
  return Math.round((totalMastered / totalCombos) * 100);
}

export function areAllVerbsDominated(
  levelProgress: LevelProgress,
  verbs: VerbEntry[],
  tenses: Tense[],
): boolean {
  return verbs.every((verb) =>
    isVerbDominated(levelProgress.verbMastery[verb.id], verb, tenses),
  );
}

export interface PracticeQuestion {
  tense: Tense;
  pronoun: string;
  acceptedAnswers: string[];
}

export function selectPracticeQuestion(
  verb: VerbEntry,
  tenses: Tense[],
  verbMastery: VerbMasteryData | undefined,
): PracticeQuestion {
  const combos = getCombosForVerb(verb, tenses);

  // Score each combo: lower = higher priority
  const scored = combos.map((comboKey) => {
    const combo = verbMastery?.[comboKey];
    let priority: number;
    if (!combo || combo.totalAttempts === 0) {
      priority = 0; // Highest priority: never attempted
    } else if (!isComboMastered(combo)) {
      priority = 1 + combo.correctCount; // Fewest correct = higher priority
    } else {
      priority = 100; // Already mastered, lowest priority
    }
    return { comboKey, priority };
  });

  // Group by priority bucket
  const minPriority = Math.min(...scored.map((s) => s.priority));
  const topBucket = scored.filter((s) => s.priority <= minPriority + 1);

  // Weighted random within top bucket
  const chosen = topBucket[Math.floor(Math.random() * topBucket.length)];
  const [tense, pronoun] = chosen.comboKey.split(":") as [Tense, string];

  return {
    tense,
    pronoun,
    acceptedAnswers: verb.conjugations[tense][pronoun],
  };
}
