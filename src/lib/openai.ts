import OpenAI from 'openai';
import { TaskEvaluation, WritingEvaluationResult, GrammarNote } from '@/types/writing';
import { buildSystemPrompt, buildUserPrompt } from './evaluationPrompt';
import {
  buildImprovementSystemPrompt,
  buildImprovementUserPrompt,
} from './improvementPrompt';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

function clampScore(score: unknown, min: number, max: number): number {
  const n = typeof score === 'number' ? score : 0;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function cefrFromScore(score: number): string {
  if (score <= 4) return 'A1';
  if (score <= 8) return 'A2';
  if (score <= 12) return 'B1';
  if (score <= 16) return 'B2';
  if (score <= 18) return 'C1';
  return 'C2';
}

export async function evaluateWriting(
  tasks: { taskId: number; prompt: string; text: string }[],
  sessionId: string
): Promise<WritingEvaluationResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(tasks) },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse OpenAI response as JSON');
  }

  // Validate and clamp the response
  const taskResults: TaskEvaluation[] = [];
  const rawTasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];

  for (const rawTask of rawTasks) {
    const t = rawTask as Record<string, unknown>;
    const criteria = Array.isArray(t.criteria)
      ? (t.criteria as Record<string, unknown>[]).map((c) => ({
          name: String(c.name ?? ''),
          score: clampScore(c.score, 0, 4),
          comment: String(c.comment ?? ''),
        }))
      : [];

    const taskScore = criteria.reduce((sum, c) => sum + c.score, 0);

    const grammarNotes = Array.isArray(t.grammarNotes)
      ? (t.grammarNotes as Record<string, unknown>[]).map((g) => ({
          excerpt: String(g.excerpt ?? ''),
          issue: String(g.issue ?? ''),
          correction: String(g.correction ?? ''),
          rule: String(g.rule ?? ''),
        }))
      : [];

    taskResults.push({
      taskId: clampScore(t.taskId, 1, 3) as 1 | 2 | 3,
      cefrLevel: cefrFromScore(taskScore),
      score: taskScore,
      criteria,
      strengths: Array.isArray(t.strengths) ? t.strengths.map(String) : [],
      weaknesses: Array.isArray(t.weaknesses) ? t.weaknesses.map(String) : [],
      grammarNotes,
      coherenceAnalysis: String(t.coherenceAnalysis ?? ''),
      lexicalAnalysis: String(t.lexicalAnalysis ?? ''),
    });
  }

  const overallScore =
    taskResults.length > 0
      ? taskResults.reduce((sum, t) => sum + t.score, 0) / taskResults.length
      : 0;

  return {
    sessionId,
    evaluatedAt: Date.now(),
    overallCefrLevel: cefrFromScore(Math.round(overallScore)),
    overallScore: Math.round(overallScore * 10) / 10,
    tasks: taskResults,
  };
}

export async function improveWriting(
  text: string,
  prompt: string,
  cefrLevel: string,
  grammarNotes: GrammarNote[]
): Promise<string> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.4,
    max_tokens: 2000,
    messages: [
      { role: 'system', content: buildImprovementSystemPrompt() },
      {
        role: 'user',
        content: buildImprovementUserPrompt(text, prompt, cefrLevel, grammarNotes),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  return content.trim();
}
