'use client';

import { useState } from 'react';
import EndpointDetails from './EndpointDetails';
import EndpointList from './EndpointList';
import { OpenApiSchema } from './types';
import { Input } from '@/components/ui/input';

interface SwaggerViewerProps {
  schema: OpenApiSchema | null;
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const;

export default function SwaggerViewer({ schema }: SwaggerViewerProps) {
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [search, setSearch] = useState('');

  if (!schema) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
        Load a valid OpenAPI schema
      </div>
    );
  }

  const baseUrl = schema.servers?.[0]?.url || '';

  let firstEndpoint = null;

  for (const [path, item] of Object.entries(schema.paths)) {
    for (const method of METHODS) {
      if (item && item[method]) {
        firstEndpoint = { path, method };
        break;
      }
    }
    if (firstEndpoint) break;
  }

  const currentPath = selectedPath || firstEndpoint?.path || '';
  const currentMethod = selectedMethod || firstEndpoint?.method || '';

  const operation =
    schema.paths[currentPath]?.[currentMethod as keyof (typeof schema.paths)[string]];

  const filteredPaths = Object.fromEntries(
    Object.entries(schema.paths).filter(([path]) =>
      path.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <div className="border-r border-zinc-200 p-4">
        <div className="mb-4">
          <Input
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <EndpointList
          paths={filteredPaths}
          selectedPath={currentPath}
          selectedMethod={currentMethod}
          onSelect={(path, method) => {
            setSelectedPath(path);
            setSelectedMethod(method);
          }}
        />
      </div>

      <div className="overflow-y-auto p-6">
        {operation && (
          <EndpointDetails
            key={`${currentMethod}-${currentPath}`}
            path={currentPath}
            method={currentMethod}
            operation={operation}
            baseUrl={baseUrl}
          />
        )}
      </div>
    </div>
  );
}
