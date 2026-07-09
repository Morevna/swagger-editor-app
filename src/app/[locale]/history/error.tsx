'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations('ErrorHistory');

  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-4">
      <h2 className="text-5xl">{t('message')}</h2>
      <p>{error.message}</p>

      <Button onClick={() => unstable_retry()}>{t('button')}</Button>
    </div>
  );
}
