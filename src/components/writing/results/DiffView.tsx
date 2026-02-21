'use client';

import { diffWords } from 'diff';

interface DiffViewProps {
  original: string;
  improved: string;
}

export function DiffView({ original, improved }: DiffViewProps) {
  const changes = diffWords(original, improved);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Original */}
      <div>
        <h4 className="mb-2 text-sm font-bold text-gray-700">Your text</h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
          {changes.map((part, i) => {
            if (part.added) return null;
            if (part.removed) {
              return (
                <span
                  key={i}
                  className="rounded bg-red-100 text-red-800 line-through"
                >
                  {part.value}
                </span>
              );
            }
            return <span key={i}>{part.value}</span>;
          })}
        </div>
      </div>

      {/* Improved */}
      <div>
        <h4 className="mb-2 text-sm font-bold text-gray-700">
          Improved version
        </h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
          {changes.map((part, i) => {
            if (part.removed) return null;
            if (part.added) {
              return (
                <span key={i} className="rounded bg-green-100 text-green-800">
                  {part.value}
                </span>
              );
            }
            return <span key={i}>{part.value}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
