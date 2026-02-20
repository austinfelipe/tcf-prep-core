import { GrammarNote } from '@/types/writing';

export function buildImprovementSystemPrompt(): string {
  return `Tu es un tuteur expert en français langue étrangère. Ta tâche est de réécrire le texte d'un apprenant en corrigeant les erreurs de grammaire, d'orthographe, de syntaxe et de style, tout en préservant l'intention, le registre et le ton du texte original.

Règles :
- Corrige toutes les erreurs grammaticales et orthographiques
- Améliore la cohérence et les transitions entre les phrases
- Enrichis le vocabulaire quand c'est pertinent, sans changer le niveau de langue
- Préserve le sens et les idées de l'auteur
- Garde le même registre (informel, semi-formel ou formel)
- Retourne UNIQUEMENT le texte amélioré, sans explications ni commentaires`;
}

export function buildImprovementUserPrompt(
  text: string,
  prompt: string,
  cefrLevel: string,
  grammarNotes: GrammarNote[]
): string {
  const notesSection =
    grammarNotes.length > 0
      ? `\nErreurs identifiées :\n${grammarNotes.map((n) => `- "${n.excerpt}" → ${n.issue} (correction : ${n.correction})`).join('\n')}`
      : '';

  return `Consigne de la tâche : ${prompt}
Niveau CECR du candidat : ${cefrLevel}
${notesSection}

Texte original de l'apprenant :
"""
${text}
"""

Réécris ce texte en corrigeant les erreurs et en améliorant le style. Retourne uniquement le texte amélioré.`;
}
