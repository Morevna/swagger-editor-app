'use client';

import { Input } from '@/components/ui/input';
import { Parameter } from './types';

interface ParameterRowProps {
  parameter: Parameter;
  value: string;
  onChange: (value: string) => void;
}

export function ParameterRow({ parameter, value, onChange }: ParameterRowProps) {
  return (
    <div
      className="
        flex flex-col gap-1.5 rounded-md border border-zinc-200 bg-white p-3
        dark:border-zinc-800 dark:bg-zinc-900
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="
            text-sm font-medium text-zinc-800
            dark:text-zinc-200
          "
        >
          {parameter.name}
          {parameter.required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
        <span
          className="
            rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 uppercase
            dark:bg-zinc-800 dark:text-zinc-400
          "
        >
          {parameter.in}
        </span>
      </div>

      {parameter.description && (
        <p
          className="
            text-xs text-zinc-500
            dark:text-zinc-400
          "
        >
          {parameter.description}
        </p>
      )}

      <Input
        className="mt-1 h-8 text-sm"
        placeholder={parameter.schema?.type ? `Type: ${parameter.schema.type}` : 'Value'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
