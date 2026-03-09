/**
 * Lookup map from masculine adjective + combo → first accepted answer.
 * Used by adverb practice tests.
 */

const ADVERB_DATA: Record<string, { féminin: string; adverbe: string | null }> = {
  'bon': { féminin: 'bonne', adverbe: 'bien' },
  'mauvais': { féminin: 'mauvaise', adverbe: 'mal' },
  'grand': { féminin: 'grande', adverbe: 'grandement' },
  'petit': { féminin: 'petite', adverbe: 'petitement' },
  'beau': { féminin: 'belle', adverbe: 'bellement' },
  'joli': { féminin: 'jolie', adverbe: 'joliment' },
  'jeune': { féminin: 'jeune', adverbe: 'jeunement' },
  'vieux': { féminin: 'vieille', adverbe: 'vieillissement' },
  'nouveau': { féminin: 'nouvelle', adverbe: 'nouvellement' },
  'gros': { féminin: 'grosse', adverbe: 'grossièrement' },
  'long': { féminin: 'longue', adverbe: 'longuement' },
  'court': { féminin: 'courte', adverbe: 'courtement' },
  'chaud': { féminin: 'chaude', adverbe: 'chaudement' },
  'froid': { féminin: 'froide', adverbe: 'froidement' },
  'blanc': { féminin: 'blanche', adverbe: 'blanchement' },
  'noir': { féminin: 'noire', adverbe: 'noirement' },
  'rouge': { féminin: 'rouge', adverbe: null },
  'bleu': { féminin: 'bleue', adverbe: null },
  'vert': { féminin: 'verte', adverbe: 'vertement' },
  'content': { féminin: 'contente', adverbe: 'contentement' },
  'triste': { féminin: 'triste', adverbe: 'tristement' },
  'facile': { féminin: 'facile', adverbe: 'facilement' },
  'difficile': { féminin: 'difficile', adverbe: 'difficilement' },
  'rapide': { féminin: 'rapide', adverbe: 'rapidement' },
  'lent': { féminin: 'lente', adverbe: 'lentement' },
  'premier': { féminin: 'première', adverbe: 'premièrement' },
  'dernier': { féminin: 'dernière', adverbe: 'dernièrement' },
  'seul': { féminin: 'seule', adverbe: 'seulement' },
  'tout': { féminin: 'toute', adverbe: 'totalement' },
  'autre': { féminin: 'autre', adverbe: 'autrement' },
};

export function lookupAdverbAnswer(masculine: string, combo: 'féminin' | 'adverbe'): string {
  const entry = ADVERB_DATA[masculine];
  if (!entry) {
    throw new Error(`No adverb data found for masculine: "${masculine}"`);
  }
  const answer = entry[combo];
  if (answer === null) {
    throw new Error(`No ${combo} form for: "${masculine}"`);
  }
  return answer;
}
