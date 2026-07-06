'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Editor from '@monaco-editor/react';
import { parseSchema, validateSchema, detectFormat, convertFormat } from '../../lib/editor-utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { OpenApiSchema } from '../viewer/types';

export type SchemaFormat = 'json' | 'yaml';

interface SwaggerEditorProps {
  onSchemaChange: (parsedData: OpenApiSchema | null) => void;
}

const defaultSchema = {
  openapi: '3.0.0',
  info: {
    title: 'Sample API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://api.example.com/v1',
    },
  ],
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        description: 'Returns all users',
      },
      post: {
        summary: 'Create user',
        description: 'Creates a new user',
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user',
        description: 'Returns a user by id',
      },
      delete: {
        summary: 'Delete user',
        description: 'Deletes a user',
      },
    },
  },
};

const INITIAL_TEXT = JSON.stringify(defaultSchema, null, 2);

export default function SwaggerEditor({ onSchemaChange }: SwaggerEditorProps) {
  const t = useTranslations('Editor');

  const [value, setValue] = useState(INITIAL_TEXT);
  const [format, setFormat] = useState<SchemaFormat>(() => detectFormat(INITIAL_TEXT));
  const [error, setError] = useState<string | null>(() => {
    const parsed = parseSchema<OpenApiSchema>(INITIAL_TEXT);
    if (parsed.error) return t(`errors.${parsed.error}`);

    const validationError = validateSchema(parsed.data);
    if (validationError) return t(`errors.${validationError}`);

    return null;
  });

  useEffect(() => {
    const parsed = parseSchema<OpenApiSchema>(INITIAL_TEXT);
    if (!parsed.error && !validateSchema(parsed.data)) {
      onSchemaChange(parsed.data);
    } else {
      onSchemaChange(null);
    }
  }, [onSchemaChange]);

  function processSchema(currentText: string) {
    const detected = detectFormat(currentText);

    setFormat((prev) => (prev !== detected ? detected : prev));

    if (!currentText.trim()) {
      setError(null);
      onSchemaChange(null);
      return;
    }

    const parsed = parseSchema<OpenApiSchema>(currentText);

    if (parsed.error) {
      setError(t(`errors.${parsed.error}`));
      onSchemaChange(null);
      return;
    }

    const validationError = validateSchema(parsed.data);

    if (validationError) {
      setError(t(`errors.${validationError}`));
      onSchemaChange(null);
      return;
    }

    setError(null);
    onSchemaChange(parsed.data);
  }

  function handleEditorChange(text: string | undefined) {
    const currentText = text || '';
    setValue(currentText);
    processSchema(currentText);
  }

  function handleFormatToggle(newFormat: SchemaFormat) {
    if (format === newFormat) return;

    const conversion = convertFormat(value);

    if (!conversion.success) {
      setError(t('errors.INVALID_FORMAT'));
      return;
    }

    setFormat(conversion.newLang);
    setValue(conversion.result);

    processSchema(conversion.result);
  }

  return (
    <div
      className="
        flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white
        dark:border-zinc-800 dark:bg-zinc-950
      "
    >
      <div
        className="
          flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2
          dark:border-zinc-800 dark:bg-zinc-900
        "
      >
        <span
          data-testid="editor-title"
          className="
            text-sm font-semibold text-zinc-700
            dark:text-zinc-300
          "
        >
          {t('title')}
        </span>

        <div
          className="
            flex rounded-md bg-zinc-200 p-0.5 text-xs font-medium
            dark:bg-zinc-800
          "
        >
          <button
            type="button"
            aria-pressed={format === 'json'}
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
            aria-pressed={format === 'yaml'}
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

      <div data-testid="editor-container" className="relative w-full flex-1">
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
          <div data-testid="editor-error" className="flex items-center gap-1.5 text-red-500">
            <AlertCircle className="size-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        ) : (
          <div
            data-testid="editor-valid"
            className="
              flex items-center gap-1.5 text-emerald-600
              dark:text-emerald-500
            "
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="font-medium">{t('noErrors')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
