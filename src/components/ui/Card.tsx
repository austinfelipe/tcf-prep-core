'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', onClick, hoverable, style }: CardProps) {
  const interactive = onClick || hoverable;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${
        interactive ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
