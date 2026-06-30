import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Layout');

  return (
    <div
      className="
      flex flex-1 items-center justify-center bg-zinc-50 p-6
      dark:bg-black
    "
    >
      <h1
        className="
        text-xl font-medium text-zinc-600
        dark:text-zinc-400
      "
      >
        {t('mainPlaceholder')}
      </h1>
    </div>
  );
}
