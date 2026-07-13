import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from './server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Supabase Server Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb-key';
  });

  it('should initialize server client and call getAll/setAll cookies', async () => {
    const mockCookieStore = {
      getAll: vi.fn().mockReturnValue([{ name: 'sb-token', value: '123' }]),
      set: vi.fn(),
    };

    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>
    );

    await createClient();

    const mockCalls = vi.mocked(createServerClient).mock.calls;
    expect(mockCalls.length).toBeGreaterThan(0);

    const config = mockCalls[0][2];

    if (config && config.cookies) {
      const cookiesConfig = config.cookies;

      if (cookiesConfig.getAll) {
        expect(cookiesConfig.getAll()).toEqual([{ name: 'sb-token', value: '123' }]);
      } else {
        throw new Error('cookies.getAll is not defined');
      }

      if (cookiesConfig.setAll) {
        const testCookies = [{ name: 'test', value: 'val', options: { path: '/' } }];
        const mockHeaders = {};

        const setAllFn = cookiesConfig.setAll as (cookies: unknown, headers: unknown) => void;
        setAllFn(testCookies, mockHeaders);

        expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'val', { path: '/' });
      } else {
        throw new Error('cookies.setAll is not defined');
      }
    } else {
      throw new Error('Cookies configuration was not provided to createServerClient');
    }
  });
});
