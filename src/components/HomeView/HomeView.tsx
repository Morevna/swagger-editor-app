'use client';

import { useState, useCallback } from 'react';
import SwaggerEditor from '@/components/editor/SwaggerEditor';
import SwaggerViewer from '@/components/viewer/SwaggerViewer';
import { OpenApiSchema } from '@/components/viewer/types';

interface HomeViewProps {
  initialSpec: string;
  isSignedIn: boolean;
}

export default function HomeView({ initialSpec, isSignedIn }: HomeViewProps) {
  const [schema, setSchema] = useState<OpenApiSchema | null>(null);
  const handleSchemaChange = useCallback((parsedData: OpenApiSchema | null) => {
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
          <SwaggerEditor
            onSchemaChange={handleSchemaChange}
            initialSchema={initialSpec}
            isSignedIn={isSignedIn}
          />
        </div>

        <div
          className="
            flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg border border-zinc-200 bg-white
            p-4
            dark:border-zinc-800 dark:bg-zinc-950
          "
        >
          <SwaggerViewer schema={schema} />
        </div>
      </div>
    </div>
  );
}
