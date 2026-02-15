export type Tense =
  | 'présent'
  | 'futur_proche'
  | 'passé_composé'
  | 'imparfait'
  | 'conditionnel_présent'
  | 'impératif'
  | 'subjonctif_présent'
  | 'plus_que_parfait';

export type Pronoun = 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils';

export type ImperativePronoun = 'tu' | 'nous' | 'vous';

export const TENSE_DISPLAY_NAMES: Record<Tense, string> = {
  présent: 'Présent',
  futur_proche: 'Futur proche',
  passé_composé: 'Passé composé',
  imparfait: 'Imparfait',
  conditionnel_présent: 'Conditionnel présent',
  impératif: 'Impératif',
  subjonctif_présent: 'Subjonctif présent',
  plus_que_parfait: 'Plus-que-parfait',
};

export interface VerbConjugations {
  [tense: string]: {
    [pronoun: string]: string[];
  };
}

export interface VerbEntry {
  id: string;
  infinitive: string;
  translation: string;
  auxiliary: 'avoir' | 'être';
  conjugations: VerbConjugations;
}
