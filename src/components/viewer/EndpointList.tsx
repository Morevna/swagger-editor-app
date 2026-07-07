'use client';

import { PathItem } from './types';

interface EndpointListProps {
  paths: Record<string, PathItem>;
  selectedPath: string;
  selectedMethod: string;
  onSelect: (path: string, method: string) => void;
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const;

const methodColors: Record<string, string> = {
  get: 'bg-emerald-100 text-emerald-700',
  post: 'bg-blue-100 text-blue-700',
  put: 'bg-amber-100 text-amber-700',
  patch: 'bg-violet-100 text-violet-700',
  delete: 'bg-red-100 text-red-700',
  options: 'bg-zinc-100 text-zinc-700',
  head: 'bg-zinc-100 text-zinc-700',
};

export default function EndpointList({
  paths,
  selectedPath,
  selectedMethod,
  onSelect,
}: EndpointListProps) {
  return (
    <div className="overflow-y-auto">
      {Object.entries(paths).map(([path, item]) => (
        <div key={path} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold">{path}</h3>

          <div className="space-y-2">
            {METHODS.map((method) => {
              if (!item[method]) return null;

              const active = selectedPath === path && selectedMethod === method;

              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => onSelect(path, method)}
                  className={`
                    flex w-full items-center justify-between rounded-md border p-3 text-left
                    transition
                    ${
                      active
                        ? 'border-blue-500 bg-blue-50'
                        : `
                          border-zinc-200
                          hover:bg-zinc-50
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      rounded-sm px-2 py-1 text-xs font-semibold uppercase
                      ${methodColors[method]}
                    `}
                  >
                    {method}
                  </span>

                  <span className="ml-3 flex-1 text-sm">{path}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
