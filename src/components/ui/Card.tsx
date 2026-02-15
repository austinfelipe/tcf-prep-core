'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable }: CardProps) {
  const interactive = onClick || hoverable;
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${
        interactive ? 'cursor-pointer transition-shadow hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
