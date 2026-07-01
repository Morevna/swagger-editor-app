'use client';

import { useState } from 'react';
import SwaggerEditor from '@/components/editor/SwaggerEditor';

export default function Home() {
  const [schema, setSchema] = useState<unknown>(null);

  function handleSchemaChange(parsedData: unknown) {
    setSchema(parsedData);
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main
        className="
          flex h-[calc(100vh-3.5rem)] flex-1 flex-col gap-6 p-6
          portrait:flex-col
          landscape:flex-row
        "
      >
        <div
          className="
            h-1/2 min-h-0 flex-1
            landscape:h-full
          "
        >
          <SwaggerEditor onSchemaChange={handleSchemaChange} />
        </div>

        <div
          className="
            h-1/2 min-h-0 flex-1 overflow-y-auto rounded-lg border
            border-zinc-200 bg-white p-4
            landscape:h-full
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
      </main>
    </div>
  );
}
