'use client';

interface OverallScoreBannerProps {
  cefrLevel: string;
  score: number;
}

function getCefrColor(level: string): string {
  if (level === 'C2' || level === 'C1') return 'bg-green-100 text-green-800 border-green-200';
  if (level === 'B2' || level === 'B1') return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-amber-100 text-amber-800 border-amber-200';
}

export function OverallScoreBanner({ cefrLevel, score }: OverallScoreBannerProps) {
  const colorClasses = getCefrColor(cefrLevel);

  return (
    <div className={`rounded-xl border-2 p-6 text-center ${colorClasses}`}>
      <p className="text-sm font-medium opacity-75">Estimated overall level</p>
      <p className="mt-2 text-5xl font-bold">{cefrLevel}</p>
      <p className="mt-2 text-2xl font-bold">{score.toFixed(1)} / 20</p>
      <p className="mt-1 text-sm opacity-75">
        Average of 3 tasks
      </p>
    </div>
  );
}
