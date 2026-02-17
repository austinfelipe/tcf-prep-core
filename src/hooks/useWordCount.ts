'use client';

import { useMemo } from 'react';
import { countWords, getWordRangeStatus, WordRangeStatus } from '@/lib/wordCount';

interface UseWordCountResult {
  count: number;
  status: WordRangeStatus;
}

export function useWordCount(text: string, min: number, max: number): UseWordCountResult {
  return useMemo(() => {
    const count = countWords(text);
    const status = getWordRangeStatus(count, min, max);
    return { count, status };
  }, [text, min, max]);
}
