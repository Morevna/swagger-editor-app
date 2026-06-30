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

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
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

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.

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

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
