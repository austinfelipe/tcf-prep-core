'use client';

import { Toast } from '@/components/ui/Toast';

interface TimeWarningToastProps {
  type: '5min' | '2min';
  onDismiss: () => void;
}

export function TimeWarningToast({ type, onDismiss }: TimeWarningToastProps) {
  const message =
    type === '5min'
      ? 'Plus que 5 minutes pour cette tâche !'
      : 'Attention : 2 minutes restantes !';

  return (
    <Toast
      message={message}
      variant={type === '5min' ? 'warning' : 'error'}
      duration={4000}
      onDismiss={onDismiss}
    />
  );
}
