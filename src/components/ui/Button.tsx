'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/50',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 disabled:bg-secondary/50 disabled:text-muted-foreground',
  ghost:
    'bg-transparent text-foreground hover:bg-muted active:bg-muted/80',
  accent:
    'bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 disabled:bg-accent/50',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
