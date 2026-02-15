'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const ACCENT_CHARS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ', 'æ'];

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ onSubmit, disabled }: AnswerInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertAccent = (char: string) => {
    const input = inputRef.current;
    if (!input) {
      setValue((prev) => prev + char);
      return;
    }
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const newVal = value.slice(0, start) + char + value.slice(end);
    setValue(newVal);
    // Restore cursor position after React re-render
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + char.length, start + char.length);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type conjugation..."
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button onClick={handleSubmit} disabled={disabled || !value.trim()}>
          Check
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ACCENT_CHARS.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => insertAccent(char)}
            disabled={disabled}
            className="rounded border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
