'use client';

import { RequestBody } from './types';
import { useTranslations } from 'next-intl';

interface RequestBodyEditorProps {
  requestBody: RequestBody;
  value: string;
  onChange: (value: string) => void;
}

export function RequestBodyEditor({ requestBody, value, onChange }: RequestBodyEditorProps) {
  const contentTypes = requestBody.content ? Object.keys(requestBody.content) : [];
  const firstType = contentTypes[0];
  const example = firstType ? requestBody.content?.[firstType]?.example : null;

  const t = useTranslations('Viewer');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="
            text-xs font-medium text-zinc-500
            dark:text-zinc-400
          "
        >
          {firstType || 'application/json'}
        </span>
        {requestBody.required && (
          <span className="text-[10px] font-semibold text-red-500 uppercase">{t('required')}</span>
        )}
      </div>

      {requestBody.description && (
        <p
          className="
            text-xs text-zinc-600
            dark:text-zinc-400
          "
        >
          {requestBody.description}
        </p>
      )}

      <textarea
        className="
          min-h-[160px] w-full rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs
          text-zinc-800 shadow-inner
          focus:border-zinc-400 focus:bg-white focus:outline-none
          dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200
          dark:focus:border-zinc-700
        "
        placeholder={example ? JSON.stringify(example, null, 2) : '{\n  "property": "value"\n}'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
