import { VerbEntry } from '@/types/conjugation';
import { a1Verbs } from './a1-verbs';
import { a2Verbs } from './a2-verbs';
import { b1Verbs } from './b1-verbs';
import { b2Verbs } from './b2-verbs';

const allVerbs: VerbEntry[] = [...a1Verbs, ...a2Verbs, ...b1Verbs, ...b2Verbs];

const verbMap = new Map<string, VerbEntry>();
for (const verb of allVerbs) {
  verbMap.set(verb.id, verb);
}

export function getVerbById(id: string): VerbEntry | undefined {
  return verbMap.get(id);
}

export function getVerbsByIds(ids: string[]): VerbEntry[] {
  return ids.map((id) => verbMap.get(id)).filter((v): v is VerbEntry => !!v);
}

export { a1Verbs, a2Verbs, b1Verbs, b2Verbs };
