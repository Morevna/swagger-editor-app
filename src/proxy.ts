import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  const i18nResponse = handleI18nRouting(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return i18nResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
