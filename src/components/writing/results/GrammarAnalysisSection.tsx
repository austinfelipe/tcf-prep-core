'use client';

import { GrammarNote } from '@/types/writing';

interface GrammarAnalysisSectionProps {
  notes: GrammarNote[];
}

export function GrammarAnalysisSection({ notes }: GrammarAnalysisSectionProps) {
  if (notes.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-gray-900">Analyse grammaticale</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="pb-2 pr-3 font-medium">Extrait</th>
              <th className="pb-2 pr-3 font-medium">Problème</th>
              <th className="pb-2 pr-3 font-medium">Correction</th>
              <th className="pb-2 font-medium">Règle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notes.map((note, i) => (
              <tr key={i}>
                <td className="py-2 pr-3 text-red-600 italic">&ldquo;{note.excerpt}&rdquo;</td>
                <td className="py-2 pr-3 text-gray-700">{note.issue}</td>
                <td className="py-2 pr-3 text-green-700 font-medium">{note.correction}</td>
                <td className="py-2 text-gray-500 text-xs">{note.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
