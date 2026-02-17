'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutosaveOptions {
  data: unknown;
  onSave: () => void;
  delay?: number;
  enabled?: boolean;
}

export function useAutosave({ data, onSave, delay = 2000, enabled = true }: UseAutosaveOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  const enabledRef = useRef(enabled);

  onSaveRef.current = onSave;
  enabledRef.current = enabled;

  // Debounced save on data change
  useEffect(() => {
    if (!enabledRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSaveRef.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);

  // Save on blur
  useEffect(() => {
    const handleBlur = () => {
      if (enabledRef.current) {
        onSaveRef.current();
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabledRef.current) {
        onSaveRef.current();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSaveRef.current();
  }, []);

  return { saveNow };
}
