'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Editor from '@monaco-editor/react';
import { parseSchema, validateSchema, detectFormat, convertFormat } from '../../lib/editor-utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { OpenApiSchema } from '../viewer/types';
import useSaveSpec from '@/lib/hooks/useSaveSpec';

export type SchemaFormat = 'json' | 'yaml';

export interface SwaggerEditorProps {
  onSchemaChange: (parsedData: OpenApiSchema | null) => void;
  initialSchema: string;
  isSignedIn: boolean;
}

const evaluateSchema = (text: string): { data: OpenApiSchema | null; errorKey: string | null } => {
  const parsed = parseSchema<OpenApiSchema>(text);
  if (parsed.error) return { data: null, errorKey: parsed.error };
  const validationError = validateSchema(parsed.data);
  if (validationError) return { data: null, errorKey: validationError };
  return { data: parsed.data, errorKey: null };
};

export default function SwaggerEditor({
  onSchemaChange,
  initialSchema,
  isSignedIn,
}: SwaggerEditorProps) {
  const t = useTranslations('Editor');

  const [value, setValue] = useState(initialSchema);
  const [format, setFormat] = useState<SchemaFormat>(() => detectFormat(initialSchema));
  const [error, setError] = useState<string | null>(() => {
    const { errorKey } = evaluateSchema(initialSchema);
    if (errorKey) return t(`errors.${errorKey}`);
    return null;
  });

  const { save, isPending, saveError, isDirty } = useSaveSpec(initialSchema, isSignedIn);

  useEffect(() => {
    const { data } = evaluateSchema(initialSchema);
    onSchemaChange(data);
  }, [initialSchema, onSchemaChange]);

  function processSchema(currentText: string) {
    const detected = detectFormat(currentText);

    setFormat((prev) => (prev !== detected ? detected : prev));

    if (!currentText.trim()) {
      setError(null);
      onSchemaChange(null);
      return;
    }

    const { data, errorKey } = evaluateSchema(currentText);

    if (errorKey) {
      setError(t(`errors.${errorKey}`));
      onSchemaChange(null);
      return;
    }

    setError(null);
    onSchemaChange(data);
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

        <div className="flex text-xs font-medium">
          {saveError && (
            <div className="flex items-center gap-1.5 text-red-500">{t(`errors.${saveError}`)}</div>
          )}
          <button
            type="button"
            onClick={() => save(value)}
            disabled={!isSignedIn || isPending || !isDirty(value)}
            className="
              mx-1 rounded-sm border border-secondary bg-zinc-200 px-2 py-1 text-black
              transition-all
              enabled:cursor-pointer
              hover:enabled:bg-zinc-50 hover:enabled:text-zinc-900
              disabled:cursor-not-allowed disabled:opacity-40
              dark:bg-zinc-950 dark:text-zinc-400
              dark:hover:enabled:bg-zinc-900 dark:hover:enabled:text-white
            "
          >
            {isPending ? t('saving') : t('save')}
          </button>

          <div
            className="
              flex rounded-md bg-zinc-200 p-0.5
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
