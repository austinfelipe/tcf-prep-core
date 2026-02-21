'use client';

interface TaskTimerProps {
  remainingMs: number;
  timeExpired: boolean;
  timerStarted: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getTimerColor(ms: number, expired: boolean): string {
  if (expired) return 'text-red-600';
  if (ms <= 2 * 60 * 1000) return 'text-red-600';
  if (ms <= 5 * 60 * 1000) return 'text-amber-600';
  return 'text-green-600';
}

export function TaskTimer({ remainingMs, timeExpired, timerStarted }: TaskTimerProps) {
  const color = getTimerColor(remainingMs, timeExpired);
  const pulsing = remainingMs <= 2 * 60 * 1000 && remainingMs > 0 && !timeExpired;

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${color} ${pulsing ? 'animate-pulse' : ''}`}>
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span>{timeExpired ? '00:00' : formatTime(remainingMs)}</span>
      {!timerStarted && (
        <span className="text-xs font-normal text-gray-400 ml-1">
          Starts on first keystroke
        </span>
      )}
    </div>
  );
}
