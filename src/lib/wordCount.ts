/**
 * French-aware word counting following TCF rules.
 * Words are split on whitespace. Elisions like "l'homme" count as 2 words.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Split on whitespace first
  const tokens = trimmed.split(/\s+/);

  let count = 0;
  for (const token of tokens) {
    // Count elisions (apostrophes) as word separators
    // e.g., "l'homme" = 2, "aujourd'hui" = 2, "c'est" = 2
    const parts = token.split(/'/);
    count += parts.filter((p) => p.length > 0).length;
  }

  return count;
}

export type WordRangeStatus = 'under' | 'in-range' | 'over';

export function getWordRangeStatus(
  count: number,
  min: number,
  max: number
): WordRangeStatus {
  if (count < min) return 'under';
  if (count > max) return 'over';
  return 'in-range';
}
