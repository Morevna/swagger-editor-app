'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();

  const switchLocale = (newLocale: string) => {
    const query = Object.fromEntries(searchParams.entries());

    router.replace({ pathname, query }, { locale: newLocale });
  };

  return (
    <select value={currentLocale} onChange={(e) => switchLocale(e.target.value)}>
      {routing.locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
