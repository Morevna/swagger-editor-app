'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Editor from '@monaco-editor/react';
import { parseSchema, validateSchema, detectFormat, convertFormat } from './editor-utils';
import type { SwaggerEditorProps, SchemaFormat } from './types';

const defaultSchema = {
  openapi: '3.0.0',
  info: {
    title: 'Sample API',
    version: '1.0.0',
  },
  paths: {},
};

export default function SwaggerEditor({ onSchemaChange }: SwaggerEditorProps) {
  const t = useTranslations('Editor');

  const [format, setFormat] = useState<SchemaFormat>('json');
  const [value, setValue] = useState(JSON.stringify(defaultSchema, null, 2));
  const [error, setError] = useState<string | null>(null);

  function handleEditorChange(text: string | undefined) {
    const currentText = text || '';
    setValue(currentText);

    if (!currentText.trim()) {
      setError(null);
      return;
    }

    const detected = detectFormat(currentText);
    if (detected !== format) {
      setFormat(detected);
    }

    const parsed = parseSchema(currentText);
    if (parsed.error) {
      setError(t(`errors.${parsed.error}`) || 'Parsing error');
      return;
    }

    const validationError = validateSchema(parsed.data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSchemaChange?.(parsed.data, detected);
  }

  function handleFormatToggle(newFormat: SchemaFormat) {
    if (format === newFormat) return;

    const conversion = convertFormat(value, format);

    if (conversion.success) {
      setFormat(newFormat);
      setValue(conversion.result);
      setError(null);

      const parsed = parseSchema(conversion.result);
      onSchemaChange?.(parsed.data, newFormat);
    } else {
      setError(t('errors.INVALID_FORMAT') || 'Cannot convert invalid format');
    }
  }

  return (
    <div
      className="
        flex h-full flex-1 flex-col overflow-hidden rounded-lg border
        border-zinc-200 bg-white
        dark:border-zinc-800 dark:bg-zinc-950
      "
    >
      <div
        className="
          flex items-center justify-between border-b border-zinc-200 bg-zinc-50
          px-4 py-2
          dark:border-zinc-800 dark:bg-zinc-900
        "
      >
        <span
          className="
            text-sm font-semibold text-zinc-700
            dark:text-zinc-300
          "
        >
          {t('title') || 'Editor'}
        </span>

        <div
          className="
            flex rounded-md bg-zinc-200 p-0.5 text-xs font-medium
            dark:bg-zinc-800
          "
        >
          <button
            type="button"
            onClick={() => handleFormatToggle('json')}
            className={`
              cursor-pointer rounded-sm px-3 py-1 transition-all
              ${
                format === 'json'
                  ? `
                    bg-white text-black shadow-sm
                    dark:bg-zinc-700 dark:text-white
                  `
                  : `
                    text-zinc-600
                    hover:text-zinc-900
                    dark:text-zinc-400
                  `
              }
            `}
          >
            JSON
          </button>
          <button
            type="button"
            onClick={() => handleFormatToggle('yaml')}
            className={`
              cursor-pointer rounded-sm px-3 py-1 transition-all
              ${
                format === 'yaml'
                  ? `
                    bg-white text-black shadow-sm
                    dark:bg-zinc-700 dark:text-white
                  `
                  : `
                    text-zinc-600
                    hover:text-zinc-900
                    dark:text-zinc-400
                  `
              }
            `}
          >
            YAML
          </button>
        </div>
      </div>

      <div className="relative h-[500px] w-full">
        <Editor
          height="100%"
          language={format}
          theme="vs-light"
          value={value}
          onChange={handleEditorChange}
          options={{
            readOnly: false,
            domReadOnly: false,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>

      <div
        className="
          border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-xs
          dark:border-zinc-800 dark:bg-zinc-900
        "
      >
        {error ? (
          <span className="font-medium text-red-500">✕ {error}</span>
        ) : (
          <span className="font-medium text-emerald-600">✓ {t('noErrors') || 'No errors'}</span>
        )}
      </div>
    </div>
  );
}
