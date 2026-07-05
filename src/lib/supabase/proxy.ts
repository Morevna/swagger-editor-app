import { routing } from '@/i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { NextURL } from 'next/dist/server/web/next-url';

import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_ROUTES, PROTECTED_ROUTES } from './auth-routes';

function getLocaleAndPath(pathname: string) {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=$|/)`);
  const match = pathname.match(localePattern);

  if (match) {
    return {
      locale: match[1],
      pathWithoutLocale: pathname.slice(match[0].length) || '/',
    };
  }

  return {
    locale: routing.defaultLocale,
    pathWithoutLocale: pathname,
  };
}

function cookieSwapAndRedirect(url: NextURL, originalResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);
  originalResponse.cookies
    .getAll()
    .map((cookie) => redirectResponse.cookies.set(cookie.name, cookie.value, cookie));
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = Boolean(data?.claims);
  const { locale, pathWithoutLocale } = getLocaleAndPath(request.nextUrl.pathname);

  if (!isAuthenticated && PROTECTED_ROUTES.includes(pathWithoutLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sign-in`;
    return cookieSwapAndRedirect(url, supabaseResponse);
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathWithoutLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/`;
    return cookieSwapAndRedirect(url, supabaseResponse);
  }

  return supabaseResponse;
}
