import {
  AdverbComboMastery,
  AdjectiveMasteryData,
  AdverbLevelProgress,
  AdjectiveEntry,
  AdverbComboType,
} from '@/types/adverb';

const MASTERY_CORRECT_THRESHOLD = 3;
const MASTERY_ACCURACY_THRESHOLD = 0.66;

export function isComboMastered(mastery: AdverbComboMastery | undefined): boolean {
  if (!mastery) return false;
  if (mastery.correctCount < MASTERY_CORRECT_THRESHOLD) return false;
  if (mastery.totalAttempts === 0) return false;
  return mastery.correctCount / mastery.totalAttempts >= MASTERY_ACCURACY_THRESHOLD;
}

export function getCombosForAdjective(adjective: AdjectiveEntry): AdverbComboType[] {
  if (adjective.adverb) {
    return ['féminin', 'adverbe'];
  }
  return ['féminin'];
}

export function isAdjectiveMastered(
  adjectiveEntry: AdjectiveEntry,
  masteryData: AdjectiveMasteryData | undefined,
): boolean {
  if (!masteryData) return false;
  const combos = getCombosForAdjective(adjectiveEntry);
  return combos.every((combo) => isComboMastered(masteryData[combo]));
}

export function areAllAdjectivesMastered(
  levelProgress: AdverbLevelProgress,
  adjectives: AdjectiveEntry[],
): boolean {
  return adjectives.every((adj) =>
    isAdjectiveMastered(adj, levelProgress.adjectiveMastery[adj.id]),
  );
}

export function getAdverbLevelCompletion(
  levelProgress: AdverbLevelProgress,
  adjectives: AdjectiveEntry[],
): { mastered: number; total: number; percent: number } {
  let total = 0;
  let mastered = 0;

  for (const adj of adjectives) {
    const combos = getCombosForAdjective(adj);
    const masteryData = levelProgress.adjectiveMastery[adj.id] ?? {};
    for (const combo of combos) {
      total++;
      if (isComboMastered(masteryData[combo])) mastered++;
    }
  }

  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100);
  return { mastered, total, percent };
}

export function selectNextQuestion(
  adjectives: AdjectiveEntry[],
  adjectiveMastery: { [adjectiveId: string]: AdjectiveMasteryData },
): { adjective: AdjectiveEntry; combo: AdverbComboType } {
  const items: { adjective: AdjectiveEntry; combo: AdverbComboType; priority: number }[] = [];

  for (const adj of adjectives) {
    const combos = getCombosForAdjective(adj);
    const masteryData = adjectiveMastery[adj.id] ?? {};

    for (const combo of combos) {
      const mastery = masteryData[combo];
      let priority: number;
      if (!mastery || mastery.totalAttempts === 0) {
        priority = 0; // Highest priority: never attempted
      } else if (!isComboMastered(mastery)) {
        priority = 1 + mastery.correctCount; // Fewest correct = higher priority
      } else {
        priority = 100; // Already mastered, lowest priority
      }
      items.push({ adjective: adj, combo, priority });
    }
  }

  const minPriority = Math.min(...items.map((i) => i.priority));
  const topBucket = items.filter((i) => i.priority <= minPriority + 1);
  const selected = topBucket[Math.floor(Math.random() * topBucket.length)];
  return { adjective: selected.adjective, combo: selected.combo };
}
