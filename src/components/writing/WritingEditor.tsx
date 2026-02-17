'use client';

import { useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';

const ACCENT_CHARS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ', 'æ'];

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFirstKeystroke?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function WritingEditor({
  value,
  onChange,
  onFirstKeystroke,
  disabled,
  placeholder = 'Commencez à écrire ici...',
}: WritingEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keystrokeTriggeredRef = useRef(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!keystrokeTriggeredRef.current && e.target.value.length > 0) {
        keystrokeTriggeredRef.current = true;
        onFirstKeystroke?.();
      }
      onChange(e.target.value);
    },
    [onChange, onFirstKeystroke]
  );

  // Reset keystroke tracking when value becomes empty (new task)
  if (value === '' && keystrokeTriggeredRef.current) {
    keystrokeTriggeredRef.current = false;
  }

  const insertAccent = useCallback(
    (char: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(value + char);
        return;
      }
      const start = textarea.selectionStart ?? value.length;
      const end = textarea.selectionEnd ?? value.length;
      const newVal = value.slice(0, start) + char + value.slice(end);
      onChange(newVal);

      if (!keystrokeTriggeredRef.current && newVal.length > 0) {
        keystrokeTriggeredRef.current = true;
        onFirstKeystroke?.();
      }

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + char.length, start + char.length);
      });
    },
    [value, onChange, onFirstKeystroke]
  );

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={12}
        className="min-h-[200px] text-base leading-relaxed"
        autoComplete="off"
        spellCheck={false}
      />
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
