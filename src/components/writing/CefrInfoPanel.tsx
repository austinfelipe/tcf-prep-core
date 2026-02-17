'use client';

import { useState } from 'react';

interface CefrInfoPanelProps {
  cefrRange: string;
}

const CEFR_DESCRIPTIONS: Record<string, string> = {
  'A1': "Peut produire des expressions simples et isolées, des phrases très courtes.",
  'A2': "Peut écrire des notes et messages simples et courts relatifs à des besoins immédiats.",
  'B1': "Peut écrire des textes articulés sur des sujets familiers ou d'intérêt personnel.",
  'B2': "Peut écrire des textes clairs et détaillés sur une gamme étendue de sujets.",
  'C1': "Peut s'exprimer dans un texte clair et bien structuré, développant son point de vue en détail.",
  'C2': "Peut écrire des textes élaborés, limpides et fluides, dans un style approprié et efficace.",
};

export function CefrInfoPanel({ cefrRange }: CefrInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm"
      >
        <span className="flex items-center gap-1.5 font-medium text-blue-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          Niveaux CECR visés : {cefrRange}
        </span>
        <svg
          className={`h-4 w-4 text-blue-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-blue-100 px-4 py-3 space-y-2">
          {Object.entries(CEFR_DESCRIPTIONS).map(([level, desc]) => (
            <div key={level} className="text-sm">
              <span className="font-semibold text-blue-800">{level} :</span>{' '}
              <span className="text-blue-700">{desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
