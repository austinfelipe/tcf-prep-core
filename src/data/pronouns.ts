import { Pronoun, ImperativePronoun } from '@/types/conjugation';

export const ALL_PRONOUNS: Pronoun[] = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

export const IMPERATIVE_PRONOUNS: ImperativePronoun[] = ['tu', 'nous', 'vous'];

export const PRONOUN_DISPLAY: Record<Pronoun, string> = {
  je: 'je',
  tu: 'tu',
  il: 'il/elle/on',
  nous: 'nous',
  vous: 'vous',
  ils: 'ils/elles',
};
