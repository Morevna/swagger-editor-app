'use client';

import { METHOD_COLORS } from '@/constants/columnsStyles';
import { Badge } from '../ui/badge';
import { PathItem } from './types';
import { Method } from '@/types/logs';

interface EndpointListProps {
  paths: Record<string, PathItem>;
  selectedPath: string;
  selectedMethod: string;
  onSelect: (path: string, method: string) => void;
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const;

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

              const badgeColor = METHOD_COLORS[method.toUpperCase() as Method];

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
                  <Badge
                    className={`
                      ${badgeColor}
                    `}
                  >
                    {method}
                  </Badge>

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
