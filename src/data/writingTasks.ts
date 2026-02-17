import { WritingTaskDefinition } from '@/types/writing';

export const WRITING_TASKS: WritingTaskDefinition[] = [
  {
    id: 1,
    title: 'Message informel',
    cefrRange: 'A1–B1/B2',
    register: 'informal',
    minWords: 60,
    maxWords: 120,
    timeLimitSeconds: 15 * 60, // 15 minutes
    criteria: [
      'Respect des consignes',
      'Cohérence et organisation',
      'Étendue du lexique',
      'Maîtrise de la grammaire',
      'Orthographe',
    ],
    prompts: [
      "Vous venez de déménager dans une nouvelle ville. Écrivez un message à un(e) ami(e) pour lui raconter votre installation et lui proposer de venir vous rendre visite. (60 à 120 mots)",
      "Un(e) ami(e) vous a invité(e) à son anniversaire mais vous ne pouvez pas y aller. Écrivez-lui un message pour vous excuser et proposer de le/la voir un autre jour. (60 à 120 mots)",
      "Vous avez passé un week-end formidable. Écrivez un message à un(e) ami(e) pour lui raconter ce que vous avez fait et lui dire pourquoi c'était si bien. (60 à 120 mots)",
    ],
  },
  {
    id: 2,
    title: 'Texte fonctionnel',
    cefrRange: 'A2–C1',
    register: 'semi-formal',
    minWords: 120,
    maxWords: 150,
    timeLimitSeconds: 20 * 60, // 20 minutes
    criteria: [
      'Respect des consignes',
      'Cohérence et organisation',
      'Étendue du lexique',
      'Maîtrise de la grammaire',
      'Orthographe',
    ],
    prompts: [
      "Vous êtes membre d'une association de quartier. Rédigez un article pour le journal local afin de présenter un événement culturel que votre association organise le mois prochain. Précisez la date, le lieu, le programme et expliquez pourquoi les habitants devraient y participer. (120 à 150 mots)",
      "Vous avez récemment utilisé un service (transport, restaurant, hôtel) qui ne vous a pas satisfait. Rédigez un courriel au service client pour décrire le problème, exprimer votre mécontentement et demander une solution. (120 à 150 mots)",
      "Votre entreprise cherche un(e) stagiaire. Rédigez une annonce pour le site web de l'entreprise en décrivant le poste, les qualités recherchées et les avantages du stage. (120 à 150 mots)",
    ],
  },
  {
    id: 3,
    title: 'Texte argumentatif',
    cefrRange: 'B1–C2',
    register: 'formal',
    minWords: 120,
    maxWords: 180,
    timeLimitSeconds: 25 * 60, // 25 minutes
    criteria: [
      'Respect des consignes',
      'Cohérence et organisation',
      'Étendue du lexique',
      'Maîtrise de la grammaire',
      'Orthographe',
    ],
    prompts: [
      "De nos jours, de plus en plus de personnes travaillent à distance. Pensez-vous que le télétravail est bénéfique pour les employés et les entreprises ? Présentez votre point de vue en développant des arguments et des exemples précis. (120 à 180 mots)",
      "Certains pensent que les réseaux sociaux rapprochent les gens, d'autres estiment qu'ils nuisent aux relations humaines. Quelle est votre opinion ? Développez votre argumentation avec des exemples concrets. (120 à 180 mots)",
      "Faut-il interdire les voitures dans les centres-villes pour protéger l'environnement ? Présentez votre opinion en développant des arguments pour et contre, puis donnez votre conclusion personnelle. (120 à 180 mots)",
    ],
  },
];

export function getWritingTask(id: number): WritingTaskDefinition | undefined {
  return WRITING_TASKS.find((t) => t.id === id);
}
