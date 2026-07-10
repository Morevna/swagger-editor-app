'use client';

import { useTranslations } from 'next-intl';
import { Operation } from '../types';
import { ParameterRow } from '../ParameterRow';

interface DetailsTabProps {
  operation: Operation;
  paramValues: Record<string, string>;
  handleParamChange: (name: string, value: string) => void;
}

export default function ParametersTab({
  operation,
  paramValues,
  handleParamChange,
}: DetailsTabProps) {
  const t = useTranslations('Viewer');

  return (
    <>
      {operation.parameters?.length ? (
        <div className="space-y-4">
          {operation.parameters.map((parameter) => (
            <ParameterRow
              key={`${parameter.in}-${parameter.name}`}
              parameter={parameter}
              value={paramValues[parameter.name] || ''}
              onChange={(val) => handleParamChange(parameter.name, val)}
            />
          ))}
        </div>
      ) : (
        <p
          className="
            text-sm text-zinc-500
            dark:text-zinc-400
          "
        >
          {t('noParameters')}
        </p>
      )}
    </>
  );
}
