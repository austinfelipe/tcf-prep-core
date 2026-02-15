'use client';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  color?: 'blue' | 'green' | 'amber';
}

const colorStyles = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
};

export function ProgressBar({ value, className = '', color = 'blue' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
