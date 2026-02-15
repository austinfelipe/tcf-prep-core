export interface ValidationResult {
  correct: boolean;
  accentError: boolean;
  expected: string;
}

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[''ʼ]/g, "'");
}

function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function validateAnswer(
  userAnswer: string,
  acceptedAnswers: string[]
): ValidationResult {
  const normalizedUser = normalize(userAnswer);

  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalize(accepted);
    if (normalizedUser === normalizedAccepted) {
      return { correct: true, accentError: false, expected: accepted };
    }
  }

  // Check if it's an accent error (correct letters, wrong accents)
  const strippedUser = stripAccents(normalizedUser);
  for (const accepted of acceptedAnswers) {
    const strippedAccepted = stripAccents(normalize(accepted));
    if (strippedUser === strippedAccepted) {
      return { correct: false, accentError: true, expected: accepted };
    }
  }

  return { correct: false, accentError: false, expected: acceptedAnswers[0] };
}
