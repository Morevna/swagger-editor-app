'use client';

import { useTranslations } from 'next-intl';
import { Operation } from '../types';
import { RequestBodyEditor } from '../RequestBodyEditor';

interface BodyTabProps {
  operation: Operation;
  bodyValue: string;
  handleBodyValueChange: (value: string) => void;
}

export default function BodyTab({ operation, bodyValue, handleBodyValueChange }: BodyTabProps) {
  const t = useTranslations('Viewer');

  return (
    <>
      {operation.requestBody ? (
        <RequestBodyEditor
          requestBody={operation.requestBody}
          value={bodyValue}
          onChange={handleBodyValueChange}
        />
      ) : (
        <p
          className="
            text-sm text-zinc-500
            dark:text-zinc-400
          "
        >
          {t('noRequestBody')}
        </p>
      )}
    </>
  );
}
