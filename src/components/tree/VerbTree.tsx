'use client';

import { VerbEntry, Tense } from '@/types/conjugation';
import { LevelProgress } from '@/types/progress';
import { isVerbDominated, getVerbProgress } from '@/lib/mastery';
import { VerbNode, VerbNodeState, NODE_SIZE } from './VerbNode';
import { TreeConnector } from './TreeConnector';

interface VerbTreeProps {
  verbs: VerbEntry[];
  tenses: Tense[];
  levelId: string;
  levelProgress: LevelProgress;
}

const VERTICAL_SPACING = 120;
const HORIZONTAL_AMPLITUDE = 60;
const TREE_CENTER_X = 180;

function getNodePosition(index: number): { x: number; y: number } {
  const y = NODE_SIZE / 2 + 20 + index * VERTICAL_SPACING;
  // Winding path: alternate left/right
  const offset = Math.sin((index * Math.PI) / 1.5) * HORIZONTAL_AMPLITUDE;
  const x = TREE_CENTER_X + offset;
  return { x, y };
}

function getVerbState(
  verb: VerbEntry,
  index: number,
  verbs: VerbEntry[],
  tenses: Tense[],
  levelProgress: LevelProgress
): VerbNodeState {
  const mastery = levelProgress.verbMastery[verb.id];
  if (isVerbDominated(mastery, verb, tenses)) return 'dominated';

  // Check if verb is unlocked (first verb or previous is dominated)
  if (index === 0) {
    const progress = getVerbProgress(mastery, verb, tenses);
    return progress.mastered > 0 ? 'in_progress' : 'available';
  }

  const prevVerb = verbs[index - 1];
  const prevMastery = levelProgress.verbMastery[prevVerb.id];
  if (!isVerbDominated(prevMastery, prevVerb, tenses)) return 'locked';

  const progress = getVerbProgress(mastery, verb, tenses);
  return progress.mastered > 0 ? 'in_progress' : 'available';
}

export function VerbTree({ verbs, tenses, levelId, levelProgress }: VerbTreeProps) {
  const positions = verbs.map((_, i) => getNodePosition(i));
  const totalHeight = (verbs.length - 1) * VERTICAL_SPACING + NODE_SIZE + 100;

  return (
    <div className="relative mx-auto" style={{ width: TREE_CENTER_X * 2, height: totalHeight }}>
      {/* Connector lines */}
      <svg
        className="absolute inset-0"
        width={TREE_CENTER_X * 2}
        height={totalHeight}
        style={{ pointerEvents: 'none' }}
      >
        {verbs.slice(1).map((_, i) => {
          const from = positions[i];
          const to = positions[i + 1];
          const state = getVerbState(verbs[i + 1], i + 1, verbs, tenses, levelProgress);
          const active = state !== 'locked';
          return (
            <TreeConnector
              key={i}
              x1={from.x}
              y1={from.y + NODE_SIZE / 2}
              x2={to.x}
              y2={to.y - NODE_SIZE / 2}
              active={active}
            />
          );
        })}
      </svg>

      {/* Verb nodes */}
      {verbs.map((verb, i) => {
        const pos = positions[i];
        const state = getVerbState(verb, i, verbs, tenses, levelProgress);
        const mastery = levelProgress.verbMastery[verb.id];
        const progress = getVerbProgress(mastery, verb, tenses);
        const progressPercent =
          progress.total > 0 ? Math.round((progress.mastered / progress.total) * 100) : 0;

        return (
          <VerbNode
            key={verb.id}
            verbId={verb.id}
            infinitive={verb.infinitive}
            translation={verb.translation}
            state={state}
            progress={progressPercent}
            levelId={levelId}
            x={pos.x}
            y={pos.y}
          />
        );
      })}
    </div>
  );
}
