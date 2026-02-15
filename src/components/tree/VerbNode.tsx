'use client';

import Link from 'next/link';

export type VerbNodeState = 'locked' | 'available' | 'in_progress' | 'dominated';

interface VerbNodeProps {
  verbId: string;
  infinitive: string;
  translation: string;
  state: VerbNodeState;
  progress: number; // 0-100
  levelId: string;
  x: number;
  y: number;
}

const NODE_SIZE = 72;

const stateStyles: Record<VerbNodeState, { ring: string; bg: string; text: string }> = {
  locked: {
    ring: 'stroke-gray-300',
    bg: 'bg-gray-100',
    text: 'text-gray-400',
  },
  available: {
    ring: 'stroke-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  in_progress: {
    ring: 'stroke-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  dominated: {
    ring: 'stroke-green-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
};

export function VerbNode({
  verbId,
  infinitive,
  translation,
  state,
  progress,
  levelId,
  x,
  y,
}: VerbNodeProps) {
  const styles = stateStyles[state];
  const isClickable = state !== 'locked';
  const radius = NODE_SIZE / 2;
  const circumference = 2 * Math.PI * (radius - 4);
  const progressOffset = circumference - (progress / 100) * circumference;

  const content = (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: x - NODE_SIZE / 2,
        top: y - NODE_SIZE / 2,
        width: NODE_SIZE,
      }}
    >
      <div className="relative">
        {/* Progress ring */}
        <svg width={NODE_SIZE} height={NODE_SIZE} className="absolute -rotate-90">
          {/* Background ring */}
          <circle
            cx={NODE_SIZE / 2}
            cy={NODE_SIZE / 2}
            r={radius - 4}
            fill="none"
            strokeWidth={4}
            className="stroke-gray-200"
          />
          {/* Progress arc */}
          {progress > 0 && (
            <circle
              cx={NODE_SIZE / 2}
              cy={NODE_SIZE / 2}
              r={radius - 4}
              fill="none"
              strokeWidth={4}
              strokeLinecap="round"
              className={styles.ring}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          )}
        </svg>

        {/* Inner circle */}
        <div
          className={`relative flex h-[${NODE_SIZE}px] w-[${NODE_SIZE}px] items-center justify-center rounded-full ${styles.bg} ${
            state === 'available' ? 'animate-pulse' : ''
          }`}
          style={{ width: NODE_SIZE, height: NODE_SIZE }}
        >
          {state === 'dominated' ? (
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : state === 'locked' ? (
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <span className={`text-sm font-bold ${styles.text}`}>
              {infinitive.slice(0, 4)}
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="mt-1 text-center">
        <p className={`text-sm font-semibold ${styles.text}`}>{infinitive}</p>
        <p className="text-xs text-gray-400">{translation}</p>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/level/${levelId}/practice/${verbId}`}>
        {content}
      </Link>
    );
  }

  return content;
}

export { NODE_SIZE };
