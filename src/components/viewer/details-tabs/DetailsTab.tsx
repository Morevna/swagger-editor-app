'use client';

import { useTranslations } from 'next-intl';
import { Operation } from '../types';

interface DetailsTabProps {
  operation: Operation;
}

export default function DetailsTab({ operation }: DetailsTabProps) {
  const t = useTranslations('Viewer');

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="
            mb-2 text-sm font-semibold text-zinc-700
            dark:text-zinc-300
          "
        >
          {t('summary')}
        </h3>
        <p
          className="
            text-sm text-zinc-600
            dark:text-zinc-400
          "
        >
          {operation.summary || t('noSummary')}
        </p>
      </div>
      <div>
        <h3
          className="
            mb-2 text-sm font-semibold text-zinc-700
            dark:text-zinc-300
          "
        >
          {t('description')}
        </h3>
        <p
          className="
            text-sm whitespace-pre-wrap text-zinc-600
            dark:text-zinc-400
          "
        >
          {operation.description || t('noDescription')}
        </p>
      </div>
    </div>
  );
}
