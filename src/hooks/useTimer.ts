'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialMs: number;
  running: boolean;
  onTick?: (remainingMs: number) => void;
  onWarning?: (type: '5min' | '2min') => void;
  onTimeUp?: () => void;
}

export function useTimer({
  initialMs,
  running,
  onTick,
  onWarning,
  onTimeUp,
}: UseTimerOptions) {
  const [remainingMs, setRemainingMs] = useState(initialMs);
  const lastTickRef = useRef<number | null>(null);
  const warned5minRef = useRef(false);
  const warned2minRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onWarningRef = useRef(onWarning);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback refs fresh
  onTickRef.current = onTick;
  onWarningRef.current = onWarning;
  onTimeUpRef.current = onTimeUp;

  // Sync external state changes
  useEffect(() => {
    setRemainingMs(initialMs);
  }, [initialMs]);

  useEffect(() => {
    if (!running || remainingMs <= 0) {
      lastTickRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = now - (lastTickRef.current ?? now);
      lastTickRef.current = now;

      setRemainingMs((prev) => {
        const next = Math.max(0, prev - delta);

        onTickRef.current?.(next);

        // Warning checks
        if (!warned5minRef.current && next <= 5 * 60 * 1000 && next > 0) {
          warned5minRef.current = true;
          onWarningRef.current?.('5min');
        }
        if (!warned2minRef.current && next <= 2 * 60 * 1000 && next > 0) {
          warned2minRef.current = true;
          onWarningRef.current?.('2min');
        }

        if (next <= 0) {
          onTimeUpRef.current?.();
        }

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, remainingMs <= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback((ms: number) => {
    setRemainingMs(ms);
    warned5minRef.current = false;
    warned2minRef.current = false;
    lastTickRef.current = null;
  }, []);

  return { remainingMs, reset };
}
