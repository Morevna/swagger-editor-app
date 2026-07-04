import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function EmptyHistoryMessage() {
  const t = useTranslations('HistoryPage');

  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div>
          <span className="text-7xl">{t('empty')}</span>
          <span>{t('emptyMessage')}</span>
        </div>
        <Button asChild>
          <Link href="/">{t('emptyButton')}</Link>
        </Button>
      </div>
    </div>
  );
}
