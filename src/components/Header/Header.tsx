import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '@/lib/actions/auth';
import { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';
import { StickyHeaderShell } from './StickyHeaderShell';

export default async function Header() {
  const t = await getTranslations('Layout');
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  return (
    <StickyHeaderShell>
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
          <Suspense fallback={<Skeleton className="h-8 w-20" />}>
            <LanguageSwitcher />
          </Suspense>

          {isSignedIn ? (
            <>
              <Link
                href="/history"
                className="
                  ms-1 text-sm transition-colors
                  hover:text-blue-400
                "
              >
                {t('history')}
              </Link>

              <form action={signOutAction}>
                <Button
                  type="submit"
                  className="cursor-pointer rounded-sm border px-4 py-1 text-sm"
                >
                  {t('signOut')}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild className="cursor-pointer rounded-sm border px-4 py-1 text-sm">
                <Link href="/sign-in">{t('signIn')}</Link>
              </Button>
              <Button asChild className="cursor-pointer rounded-sm bg-blue-600 px-4 py-1 text-sm">
                <Link href="/sign-up">{t('signUp')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </StickyHeaderShell>
  );
}
