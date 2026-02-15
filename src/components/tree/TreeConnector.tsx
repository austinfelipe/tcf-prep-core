'use client';

interface TreeConnectorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}

export function TreeConnector({ x1, y1, x2, y2, active }: TreeConnectorProps) {
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      className={active ? 'stroke-blue-300' : 'stroke-gray-200'}
    />
  );
}
