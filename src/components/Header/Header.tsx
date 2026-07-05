import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Layout');

  return (
    <header className="sticky top-0 z-50 border-b bg-slate-950 text-white">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="Swagger Editor" width={44} height={44} />
            Swagger Editor
          </Link>

          <Link
            href="/about"
            className="
              text-sm transition-colors
              hover:text-blue-400
            "
          >
            {t('about')}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Button className="cursor-pointer rounded-sm border px-4 py-1 text-sm">
            {t('signIn')}
          </Button>

          <Button className="cursor-pointer rounded-sm bg-blue-600 px-4 py-1 text-sm">
            {t('signUp')}
          </Button>
        </div>
      </div>
    </header>
  );
}
