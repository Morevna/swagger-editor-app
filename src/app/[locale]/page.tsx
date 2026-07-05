'use client';

import { useState, useCallback } from 'react';
import SwaggerEditor from '@/components/editor/SwaggerEditor';

export default function Home() {
  const [schema, setSchema] = useState<unknown | null>(null);

  const handleSchemaChange = useCallback((parsedData: unknown | null) => {
    setSchema(parsedData);
  }, []);

  return (
    <div
      className="
        flex min-h-0 flex-1 flex-col bg-zinc-50
        dark:bg-black
      "
    >
      <div
        className="
          flex min-h-0 flex-1 gap-6 p-6
          portrait:flex-col
          landscape:flex-row
        "
      >
        <div className="flex min-h-0 flex-1">
          <SwaggerEditor onSchemaChange={handleSchemaChange} />
        </div>

        <div
          className="
            flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg border border-zinc-200 bg-white
            p-4
            dark:border-zinc-800 dark:bg-zinc-950
          "
        >
          <h2
            className="
              mb-4 text-sm font-semibold text-zinc-700
              dark:text-zinc-300
            "
          >
            Viewer
          </h2>
          {schema ? (
            <p className="text-xs text-zinc-500">Схема готова для отображения эндпоинтов...</p>
          ) : (
            <p className="text-xs text-zinc-400">Введите валидную OpenAPI спецификацию слева</p>
          )}
        </div>
      </div>
    </div>
  );
}
