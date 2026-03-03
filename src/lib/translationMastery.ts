import { PhraseMastery, TranslationLevelProgress } from '@/types/translation';
import { TranslationPhrase } from '@/types/translation';

const MASTERY_CORRECT_THRESHOLD = 3;
const MASTERY_ACCURACY_THRESHOLD = 0.66;

export function isPhraseMastered(mastery: PhraseMastery | undefined): boolean {
  if (!mastery) return false;
  if (mastery.correctCount < MASTERY_CORRECT_THRESHOLD) return false;
  if (mastery.totalAttempts === 0) return false;
  return mastery.correctCount / mastery.totalAttempts >= MASTERY_ACCURACY_THRESHOLD;
}

export function areAllPhrasesMastered(
  levelProgress: TranslationLevelProgress,
  phraseIds: string[],
): boolean {
  return phraseIds.every((id) => isPhraseMastered(levelProgress.phraseMastery[id]));
}

export function getTranslationLevelCompletion(
  levelProgress: TranslationLevelProgress,
  phraseIds: string[],
): { mastered: number; total: number; percent: number } {
  const total = phraseIds.length;
  const mastered = phraseIds.filter((id) =>
    isPhraseMastered(levelProgress.phraseMastery[id]),
  ).length;
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100);
  return { mastered, total, percent };
}

export function selectNextPhrase(
  phrases: TranslationPhrase[],
  phraseMastery: { [phraseId: string]: PhraseMastery },
): TranslationPhrase {
  const scored = phrases.map((phrase) => {
    const mastery = phraseMastery[phrase.id];
    let priority: number;
    if (!mastery || mastery.totalAttempts === 0) {
      priority = 0; // Highest priority: never attempted
    } else if (!isPhraseMastered(mastery)) {
      priority = 1 + mastery.correctCount; // Fewest correct = higher priority
    } else {
      priority = 100; // Already mastered, lowest priority
    }
    return { phrase, priority };
  });

  const minPriority = Math.min(...scored.map((s) => s.priority));
  const topBucket = scored.filter((s) => s.priority <= minPriority + 1);
  return topBucket[Math.floor(Math.random() * topBucket.length)].phrase;
}
