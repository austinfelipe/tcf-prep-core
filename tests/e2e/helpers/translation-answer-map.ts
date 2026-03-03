/**
 * Lookup map from English phrase → first French accepted answer.
 * Used by translation practice tests.
 */

const TRANSLATION_DATA: Record<string, string> = {
  'Hello!': 'Bonjour !',
  'Goodbye!': 'Au revoir !',
  'Please.': "S'il vous plaît.",
  'Thank you.': 'Merci.',
  'Yes.': 'Oui.',
  'No.': 'Non.',
  'My name is Marie.': "Je m'appelle Marie.",
  'I am a student.': 'Je suis étudiant.',
  'I am French.': 'Je suis français.',
  'How are you?': 'Comment allez-vous ?',
  'I am fine.': 'Je vais bien.',
  'I live in Paris.': "J'habite à Paris.",
  'I like coffee.': "J'aime le café.",
  'I do not understand.': 'Je ne comprends pas.',
  'I speak French.': 'Je parle français.',
  'Where is the station?': 'Où est la gare ?',
  'I have a cat.': "J'ai un chat.",
  'It is hot today.': "Il fait chaud aujourd'hui.",
  'I am hungry.': "J'ai faim.",
  'Good evening!': 'Bonsoir !',
};

export function lookupTranslation(english: string): string {
  const answer = TRANSLATION_DATA[english];
  if (!answer) {
    throw new Error(`No translation answer found for: "${english}"`);
  }
  return answer;
}
