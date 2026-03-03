import {
  TranslationPhrase,
  TranslationLevelDefinition,
  TranslationLevelId,
} from '@/types/translation';

export const TRANSLATION_PHRASES: TranslationPhrase[] = [
  // === A1 (20 phrases) — Basic greetings, introductions, simple daily life ===
  { id: 'a1-01', level: 'a1', english: 'Hello!', acceptedAnswers: ['Bonjour !', 'Bonjour!', 'Salut !', 'Salut!'] },
  { id: 'a1-02', level: 'a1', english: 'Goodbye!', acceptedAnswers: ['Au revoir !', 'Au revoir!'] },
  { id: 'a1-03', level: 'a1', english: 'Please.', acceptedAnswers: ["S'il vous plaît.", "S'il te plaît.", "S'il vous plait.", "S'il te plait."] },
  { id: 'a1-04', level: 'a1', english: 'Thank you.', acceptedAnswers: ['Merci.'] },
  { id: 'a1-05', level: 'a1', english: 'Yes.', acceptedAnswers: ['Oui.'] },
  { id: 'a1-06', level: 'a1', english: 'No.', acceptedAnswers: ['Non.'] },
  { id: 'a1-07', level: 'a1', english: 'My name is Marie.', acceptedAnswers: ['Je m\'appelle Marie.', 'Mon nom est Marie.'] },
  { id: 'a1-08', level: 'a1', english: 'I am a student.', acceptedAnswers: ['Je suis étudiant.', 'Je suis étudiante.', 'Je suis étudiant(e).'] },
  { id: 'a1-09', level: 'a1', english: 'I am French.', acceptedAnswers: ['Je suis français.', 'Je suis française.'] },
  { id: 'a1-10', level: 'a1', english: 'How are you?', acceptedAnswers: ['Comment allez-vous ?', 'Comment allez-vous?', 'Comment vas-tu ?', 'Comment vas-tu?', 'Ça va ?', 'Ça va?'] },
  { id: 'a1-11', level: 'a1', english: 'I am fine.', acceptedAnswers: ['Je vais bien.', 'Ça va bien.', 'Ça va.'] },
  { id: 'a1-12', level: 'a1', english: 'I live in Paris.', acceptedAnswers: ["J'habite à Paris.", 'Je vis à Paris.'] },
  { id: 'a1-13', level: 'a1', english: 'I like coffee.', acceptedAnswers: ["J'aime le café."] },
  { id: 'a1-14', level: 'a1', english: 'I do not understand.', acceptedAnswers: ['Je ne comprends pas.'] },
  { id: 'a1-15', level: 'a1', english: 'I speak French.', acceptedAnswers: ['Je parle français.'] },
  { id: 'a1-16', level: 'a1', english: 'Where is the station?', acceptedAnswers: ['Où est la gare ?', 'Où est la gare?'] },
  { id: 'a1-17', level: 'a1', english: 'I have a cat.', acceptedAnswers: ["J'ai un chat."] },
  { id: 'a1-18', level: 'a1', english: 'It is hot today.', acceptedAnswers: ["Il fait chaud aujourd'hui."] },
  { id: 'a1-19', level: 'a1', english: 'I am hungry.', acceptedAnswers: ["J'ai faim."] },
  { id: 'a1-20', level: 'a1', english: 'Good evening!', acceptedAnswers: ['Bonsoir !', 'Bonsoir!'] },

  // === A2 (25 phrases) — Daily routines, shopping, travel, opinions ===
  { id: 'a2-01', level: 'a2', english: 'I wake up at seven o\'clock.', acceptedAnswers: ['Je me réveille à sept heures.', 'Je me lève à sept heures.'] },
  { id: 'a2-02', level: 'a2', english: 'I take the bus every day.', acceptedAnswers: ['Je prends le bus tous les jours.'] },
  { id: 'a2-03', level: 'a2', english: 'She is French.', acceptedAnswers: ['Elle est française.'] },
  { id: 'a2-04', level: 'a2', english: 'We eat dinner at eight.', acceptedAnswers: ['Nous dînons à huit heures.', 'On dîne à huit heures.', 'Nous dinons à huit heures.', 'On dine à huit heures.'] },
  { id: 'a2-05', level: 'a2', english: 'How much does it cost?', acceptedAnswers: ['Combien ça coûte ?', 'Combien ça coûte?', 'Combien ça coute ?', 'Combien ça coute?', 'C\'est combien ?', 'C\'est combien?'] },
  { id: 'a2-06', level: 'a2', english: 'I would like a coffee, please.', acceptedAnswers: ["Je voudrais un café, s'il vous plaît.", "Je voudrais un café, s'il vous plait.", "Je voudrais un café, s'il te plaît.", "Je voudrais un café, s'il te plait."] },
  { id: 'a2-07', level: 'a2', english: 'I went to the cinema yesterday.', acceptedAnswers: ['Je suis allé au cinéma hier.', 'Je suis allée au cinéma hier.'] },
  { id: 'a2-08', level: 'a2', english: 'The weather is nice today.', acceptedAnswers: ["Il fait beau aujourd'hui."] },
  { id: 'a2-09', level: 'a2', english: 'I have to work tomorrow.', acceptedAnswers: ['Je dois travailler demain.'] },
  { id: 'a2-10', level: 'a2', english: 'Can you help me?', acceptedAnswers: ['Pouvez-vous m\'aider ?', 'Pouvez-vous m\'aider?', 'Peux-tu m\'aider ?', 'Peux-tu m\'aider?', 'Est-ce que vous pouvez m\'aider ?', 'Est-ce que vous pouvez m\'aider?'] },
  { id: 'a2-11', level: 'a2', english: 'I like reading books.', acceptedAnswers: ["J'aime lire des livres."] },
  { id: 'a2-12', level: 'a2', english: 'Where do you live?', acceptedAnswers: ['Où habitez-vous ?', 'Où habitez-vous?', 'Où habites-tu ?', 'Où habites-tu?', 'Où est-ce que vous habitez ?', 'Où est-ce que vous habitez?', 'Où est-ce que tu habites ?', 'Où est-ce que tu habites?'] },
  { id: 'a2-13', level: 'a2', english: 'I am looking for the museum.', acceptedAnswers: ['Je cherche le musée.'] },
  { id: 'a2-14', level: 'a2', english: 'He works in a restaurant.', acceptedAnswers: ['Il travaille dans un restaurant.'] },
  { id: 'a2-15', level: 'a2', english: 'We are going to the beach.', acceptedAnswers: ['Nous allons à la plage.', 'On va à la plage.'] },
  { id: 'a2-16', level: 'a2', english: 'I bought a new book.', acceptedAnswers: ["J'ai acheté un nouveau livre."] },
  { id: 'a2-17', level: 'a2', english: 'Do you speak English?', acceptedAnswers: ['Parlez-vous anglais ?', 'Parlez-vous anglais?', 'Parles-tu anglais ?', 'Parles-tu anglais?', 'Est-ce que vous parlez anglais ?', 'Est-ce que vous parlez anglais?'] },
  { id: 'a2-18', level: 'a2', english: 'I need to buy bread.', acceptedAnswers: ["J'ai besoin d'acheter du pain.", 'Je dois acheter du pain.'] },
  { id: 'a2-19', level: 'a2', english: 'The train arrives at noon.', acceptedAnswers: ['Le train arrive à midi.'] },
  { id: 'a2-20', level: 'a2', english: 'I don\'t like this film.', acceptedAnswers: ["Je n'aime pas ce film."] },
  { id: 'a2-21', level: 'a2', english: 'She has two children.', acceptedAnswers: ['Elle a deux enfants.'] },
  { id: 'a2-22', level: 'a2', english: 'I play football on Saturdays.', acceptedAnswers: ['Je joue au football le samedi.', 'Je joue au foot le samedi.'] },
  { id: 'a2-23', level: 'a2', english: 'It is raining.', acceptedAnswers: ['Il pleut.'] },
  { id: 'a2-24', level: 'a2', english: 'I left my keys at home.', acceptedAnswers: ["J'ai laissé mes clés à la maison.", "J'ai oublié mes clés à la maison."] },
  { id: 'a2-25', level: 'a2', english: 'We had a good time.', acceptedAnswers: ['Nous avons passé un bon moment.', 'On a passé un bon moment.'] },

  // === B1 (25 phrases) — Opinions, comparisons, past narration, hypotheticals ===
  { id: 'b1-01', level: 'b1', english: 'I think that this film is interesting.', acceptedAnswers: ['Je pense que ce film est intéressant.', 'Je trouve que ce film est intéressant.'] },
  { id: 'b1-02', level: 'b1', english: 'If I had time, I would travel more.', acceptedAnswers: ["Si j'avais le temps, je voyagerais plus.", "Si j'avais le temps, je voyagerais davantage."] },
  { id: 'b1-03', level: 'b1', english: 'She told me that she was tired.', acceptedAnswers: ["Elle m'a dit qu'elle était fatiguée."] },
  { id: 'b1-04', level: 'b1', english: 'I have been living in France for three years.', acceptedAnswers: ["J'habite en France depuis trois ans.", 'Je vis en France depuis trois ans.'] },
  { id: 'b1-05', level: 'b1', english: 'You should see a doctor.', acceptedAnswers: ['Tu devrais voir un médecin.', 'Vous devriez voir un médecin.', 'Tu devrais consulter un médecin.', 'Vous devriez consulter un médecin.'] },
  { id: 'b1-06', level: 'b1', english: 'I would like to learn Japanese.', acceptedAnswers: ["J'aimerais apprendre le japonais.", 'Je voudrais apprendre le japonais.'] },
  { id: 'b1-07', level: 'b1', english: 'It is important to protect the environment.', acceptedAnswers: ["Il est important de protéger l'environnement.", "C'est important de protéger l'environnement."] },
  { id: 'b1-08', level: 'b1', english: 'I was reading when he called me.', acceptedAnswers: ["Je lisais quand il m'a appelé.", "J'étais en train de lire quand il m'a appelé."] },
  { id: 'b1-09', level: 'b1', english: 'This restaurant is better than the other one.', acceptedAnswers: ["Ce restaurant est meilleur que l'autre.", "Ce restaurant est mieux que l'autre."] },
  { id: 'b1-10', level: 'b1', english: 'I don\'t know if he is coming.', acceptedAnswers: ["Je ne sais pas s'il vient.", "Je ne sais pas s'il va venir."] },
  { id: 'b1-11', level: 'b1', english: 'We need to find a solution.', acceptedAnswers: ['Nous devons trouver une solution.', 'Il faut trouver une solution.', 'On doit trouver une solution.'] },
  { id: 'b1-12', level: 'b1', english: 'I have just finished my homework.', acceptedAnswers: ['Je viens de finir mes devoirs.', 'Je viens de terminer mes devoirs.'] },
  { id: 'b1-13', level: 'b1', english: 'Could you explain this to me?', acceptedAnswers: ['Pourriez-vous m\'expliquer cela ?', 'Pourriez-vous m\'expliquer cela?', 'Pourrais-tu m\'expliquer cela ?', 'Pourrais-tu m\'expliquer cela?', 'Est-ce que vous pourriez m\'expliquer cela ?', 'Est-ce que vous pourriez m\'expliquer cela?'] },
  { id: 'b1-14', level: 'b1', english: 'I am interested in French history.', acceptedAnswers: ["Je m'intéresse à l'histoire de France.", "L'histoire de France m'intéresse."] },
  { id: 'b1-15', level: 'b1', english: 'He has never been to Canada.', acceptedAnswers: ["Il n'est jamais allé au Canada.", "Il n'a jamais été au Canada."] },
  { id: 'b1-16', level: 'b1', english: 'I will call you when I arrive.', acceptedAnswers: ["Je t'appellerai quand j'arriverai.", "Je vous appellerai quand j'arriverai.", "Je t'appelle quand j'arrive."] },
  { id: 'b1-17', level: 'b1', english: 'I regret not having studied more.', acceptedAnswers: ["Je regrette de ne pas avoir plus étudié.", "Je regrette de ne pas avoir étudié davantage."] },
  { id: 'b1-18', level: 'b1', english: 'It seems that it is going to rain.', acceptedAnswers: ["Il semble qu'il va pleuvoir.", 'On dirait qu\'il va pleuvoir.'] },
  { id: 'b1-19', level: 'b1', english: 'I am saving money to buy a car.', acceptedAnswers: ["J'économise de l'argent pour acheter une voiture.", "Je fais des économies pour acheter une voiture."] },
  { id: 'b1-20', level: 'b1', english: 'They moved to Lyon last year.', acceptedAnswers: ["Ils ont déménagé à Lyon l'année dernière.", "Elles ont déménagé à Lyon l'année dernière."] },
  { id: 'b1-21', level: 'b1', english: 'I prefer tea to coffee.', acceptedAnswers: ['Je préfère le thé au café.'] },
  { id: 'b1-22', level: 'b1', english: 'She works as a teacher.', acceptedAnswers: ['Elle travaille comme professeure.', 'Elle travaille comme enseignante.', 'Elle est professeure.', 'Elle est enseignante.'] },
  { id: 'b1-23', level: 'b1', english: 'I forgot to lock the door.', acceptedAnswers: ["J'ai oublié de fermer la porte à clé.", "J'ai oublié de verrouiller la porte."] },
  { id: 'b1-24', level: 'b1', english: 'It is forbidden to smoke here.', acceptedAnswers: ['Il est interdit de fumer ici.', 'C\'est interdit de fumer ici.', 'Défense de fumer ici.'] },
  { id: 'b1-25', level: 'b1', english: 'I have been waiting for twenty minutes.', acceptedAnswers: ["J'attends depuis vingt minutes.", "Ça fait vingt minutes que j'attends."] },

  // === B2 (30 phrases) — Nuanced opinions, complex grammar, abstract topics ===
  { id: 'b2-01', level: 'b2', english: 'Although he is young, he is very mature.', acceptedAnswers: ["Bien qu'il soit jeune, il est très mature.", "Même s'il est jeune, il est très mature."] },
  { id: 'b2-02', level: 'b2', english: 'I doubt that he will come on time.', acceptedAnswers: ["Je doute qu'il arrive à l'heure.", "Je doute qu'il vienne à l'heure."] },
  { id: 'b2-03', level: 'b2', english: 'If I had known, I would not have gone.', acceptedAnswers: ["Si j'avais su, je ne serais pas allé.", "Si j'avais su, je ne serais pas allée.", "Si j'avais su, je n'y serais pas allé.", "Si j'avais su, je n'y serais pas allée."] },
  { id: 'b2-04', level: 'b2', english: 'It is essential that everyone participates.', acceptedAnswers: ['Il est essentiel que tout le monde participe.', 'Il est indispensable que tout le monde participe.'] },
  { id: 'b2-05', level: 'b2', english: 'The more I read, the more I learn.', acceptedAnswers: ["Plus je lis, plus j'apprends."] },
  { id: 'b2-06', level: 'b2', english: 'He acts as if he knew everything.', acceptedAnswers: ['Il agit comme s\'il savait tout.', 'Il fait comme s\'il savait tout.'] },
  { id: 'b2-07', level: 'b2', english: 'Whatever you decide, I will support you.', acceptedAnswers: ['Quoi que tu décides, je te soutiendrai.', 'Quoi que vous décidiez, je vous soutiendrai.'] },
  { id: 'b2-08', level: 'b2', english: 'I would have liked to be there.', acceptedAnswers: ["J'aurais aimé être là.", "J'aurais voulu être là."] },
  { id: 'b2-09', level: 'b2', english: 'She left without saying goodbye.', acceptedAnswers: ['Elle est partie sans dire au revoir.'] },
  { id: 'b2-10', level: 'b2', english: 'It is necessary that you finish before Friday.', acceptedAnswers: ['Il faut que tu finisses avant vendredi.', 'Il faut que vous finissiez avant vendredi.', 'Il est nécessaire que tu finisses avant vendredi.', 'Il est nécessaire que vous finissiez avant vendredi.'] },
  { id: 'b2-11', level: 'b2', english: 'Not only is he intelligent, but he is also kind.', acceptedAnswers: ['Non seulement il est intelligent, mais il est aussi gentil.', 'Non seulement il est intelligent, mais en plus il est gentil.'] },
  { id: 'b2-12', level: 'b2', english: 'I was told that the meeting had been cancelled.', acceptedAnswers: ["On m'a dit que la réunion avait été annulée."] },
  { id: 'b2-13', level: 'b2', english: 'Unless it rains, we will go hiking.', acceptedAnswers: ["À moins qu'il pleuve, nous irons randonner.", "À moins qu'il pleuve, on ira randonner.", "Sauf s'il pleut, nous irons randonner.", "Sauf s'il pleut, on ira randonner."] },
  { id: 'b2-14', level: 'b2', english: 'This is the book that I told you about.', acceptedAnswers: ["C'est le livre dont je t'ai parlé.", "C'est le livre dont je vous ai parlé."] },
  { id: 'b2-15', level: 'b2', english: 'He succeeded thanks to his determination.', acceptedAnswers: ['Il a réussi grâce à sa détermination.'] },
  { id: 'b2-16', level: 'b2', english: 'I am afraid that he will be disappointed.', acceptedAnswers: ["J'ai peur qu'il soit déçu.", "Je crains qu'il soit déçu.", "Je crains qu'il ne soit déçu."] },
  { id: 'b2-17', level: 'b2', english: 'She denied having lied.', acceptedAnswers: ['Elle a nié avoir menti.'] },
  { id: 'b2-18', level: 'b2', english: 'By the time you arrive, I will have already left.', acceptedAnswers: ['Quand tu arriveras, je serai déjà parti.', 'Quand tu arriveras, je serai déjà partie.', 'Quand vous arriverez, je serai déjà parti.', 'Quand vous arriverez, je serai déjà partie.'] },
  { id: 'b2-19', level: 'b2', english: 'The problem is that nobody takes responsibility.', acceptedAnswers: ["Le problème, c'est que personne ne prend ses responsabilités.", "Le problème est que personne ne prend ses responsabilités."] },
  { id: 'b2-20', level: 'b2', english: 'I was surprised that she did not react.', acceptedAnswers: ["J'ai été surpris qu'elle n'ait pas réagi.", "J'ai été surprise qu'elle n'ait pas réagi.", "J'étais surpris qu'elle ne réagisse pas.", "J'étais surprise qu'elle ne réagisse pas."] },
  { id: 'b2-21', level: 'b2', english: 'Provided that you agree, we can start.', acceptedAnswers: ['Pourvu que vous soyez d\'accord, nous pouvons commencer.', 'Pourvu que tu sois d\'accord, nous pouvons commencer.', 'À condition que vous soyez d\'accord, nous pouvons commencer.', 'À condition que tu sois d\'accord, on peut commencer.'] },
  { id: 'b2-22', level: 'b2', english: 'He had already left when I arrived.', acceptedAnswers: ['Il était déjà parti quand je suis arrivé.', 'Il était déjà parti quand je suis arrivée.'] },
  { id: 'b2-23', level: 'b2', english: 'It is unlikely that they will accept the proposal.', acceptedAnswers: ["Il est peu probable qu'ils acceptent la proposition.", "Il est peu probable qu'elles acceptent la proposition."] },
  { id: 'b2-24', level: 'b2', english: 'The article highlights the importance of education.', acceptedAnswers: ["L'article souligne l'importance de l'éducation.", "L'article met en avant l'importance de l'éducation."] },
  { id: 'b2-25', level: 'b2', english: 'Despite the difficulties, they persevered.', acceptedAnswers: ['Malgré les difficultés, ils ont persévéré.', 'Malgré les difficultés, elles ont persévéré.'] },
  { id: 'b2-26', level: 'b2', english: 'I wish he would listen to me more.', acceptedAnswers: ["J'aimerais qu'il m'écoute davantage.", "J'aimerais qu'il m'écoute plus.", "Je voudrais qu'il m'écoute davantage.", "Je voudrais qu'il m'écoute plus."] },
  { id: 'b2-27', level: 'b2', english: 'No matter what happens, stay calm.', acceptedAnswers: ['Quoi qu\'il arrive, reste calme.', 'Quoi qu\'il arrive, restez calme.', 'Peu importe ce qui arrive, reste calme.', 'Peu importe ce qui arrive, restez calme.'] },
  { id: 'b2-28', level: 'b2', english: 'The film was so boring that I fell asleep.', acceptedAnswers: ["Le film était tellement ennuyeux que je me suis endormi.", "Le film était tellement ennuyeux que je me suis endormie.", "Le film était si ennuyeux que je me suis endormi.", "Le film était si ennuyeux que je me suis endormie."] },
  { id: 'b2-29', level: 'b2', english: 'He asked me to close the window.', acceptedAnswers: ["Il m'a demandé de fermer la fenêtre."] },
  { id: 'b2-30', level: 'b2', english: 'We should have left earlier.', acceptedAnswers: ['Nous aurions dû partir plus tôt.', 'On aurait dû partir plus tôt.'] },
];

// Phrase lookup helpers
const phraseMap = new Map<string, TranslationPhrase>();
for (const phrase of TRANSLATION_PHRASES) {
  phraseMap.set(phrase.id, phrase);
}

export function getPhraseById(id: string): TranslationPhrase | undefined {
  return phraseMap.get(id);
}

export function getPhrasesForLevel(levelId: TranslationLevelId): TranslationPhrase[] {
  return TRANSLATION_PHRASES.filter((p) => p.level === levelId);
}

// Level definitions
export const TRANSLATION_LEVELS: TranslationLevelDefinition[] = [
  {
    id: 'a1',
    label: 'A1',
    description: 'Beginner — Basic greetings, introductions & simple daily phrases',
    phraseIds: TRANSLATION_PHRASES.filter((p) => p.level === 'a1').map((p) => p.id),
  },
  {
    id: 'a2',
    label: 'A2',
    description: 'Elementary — Daily routines, shopping, travel & opinions',
    phraseIds: TRANSLATION_PHRASES.filter((p) => p.level === 'a2').map((p) => p.id),
  },
  {
    id: 'b1',
    label: 'B1',
    description: 'Intermediate — Opinions, comparisons & hypotheticals',
    phraseIds: TRANSLATION_PHRASES.filter((p) => p.level === 'b1').map((p) => p.id),
  },
  {
    id: 'b2',
    label: 'B2',
    description: 'Upper intermediate — Nuanced opinions, subjunctive & abstract topics',
    phraseIds: TRANSLATION_PHRASES.filter((p) => p.level === 'b2').map((p) => p.id),
  },
];

export function getTranslationLevelById(id: string): TranslationLevelDefinition | undefined {
  return TRANSLATION_LEVELS.find((l) => l.id === id);
}
