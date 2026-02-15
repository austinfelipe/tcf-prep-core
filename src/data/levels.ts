import { LevelDefinition } from '@/types/level';

export const LEVELS: LevelDefinition[] = [
  {
    id: 'a1',
    label: 'A1',
    description: 'Beginner – Essential verbs in présent, futur proche & passé composé',
    tenses: ['présent', 'futur_proche', 'passé_composé'],
    verbIds: [
      'etre', 'avoir', 'faire', 'aller', 'pouvoir',
      'vouloir', 'devoir', 'savoir', 'dire', 'venir',
      'prendre', 'mettre', 'voir', 'parler', 'manger',
    ],
    testQuestionCount: 40,
    passThreshold: 0.8,
  },
  {
    id: 'a2',
    label: 'A2',
    description: 'Elementary – More verbs plus imparfait',
    tenses: ['présent', 'futur_proche', 'passé_composé', 'imparfait'],
    verbIds: [
      'connaitre', 'croire', 'trouver', 'donner', 'penser',
      'arriver', 'partir', 'sortir', 'ecrire', 'lire',
      'comprendre', 'attendre', 'entendre', 'rester', 'tomber',
    ],
    testQuestionCount: 35,
    passThreshold: 0.8,
  },
  {
    id: 'b1',
    label: 'B1',
    description: 'Intermediate – Conditionnel & impératif added',
    tenses: ['présent', 'futur_proche', 'passé_composé', 'imparfait', 'conditionnel_présent', 'impératif'],
    verbIds: [
      'vivre', 'suivre', 'ouvrir', 'recevoir', 'tenir',
      'apprendre', 'perdre', 'produire', 'servir', 'repondre',
      'choisir', 'rendre', 'obtenir', 'courir', 'devenir', 'mourir',
    ],
    testQuestionCount: 35,
    passThreshold: 0.8,
  },
  {
    id: 'b2',
    label: 'B2',
    description: 'Upper intermediate – Subjonctif & plus-que-parfait',
    tenses: [
      'présent', 'futur_proche', 'passé_composé', 'imparfait',
      'conditionnel_présent', 'impératif', 'subjonctif_présent', 'plus_que_parfait',
    ],
    verbIds: [
      'resoudre', 'craindre', 'peindre', 'joindre', 'acquerir',
      'vaincre', 'conclure', 'exclure', 'naitre', 'paraitre',
      'plaire', 'se_souvenir', 'construire', 'conduire', 'detruire', 'traduire',
    ],
    testQuestionCount: 30,
    passThreshold: 0.8,
  },
];

export function getLevelById(id: string): LevelDefinition | undefined {
  return LEVELS.find((l) => l.id === id);
}
