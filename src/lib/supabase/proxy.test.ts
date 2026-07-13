import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';
import { updateSession } from './proxy';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn().mockImplementation(() => ({
    auth: {
      getClaims: vi.fn(),
    },
  })),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
}));

describe('updateSession middleware', () => {
  let mockGetClaims: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'mock-key';

    mockGetClaims = vi.fn();
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getClaims: mockGetClaims,
      },
    } as unknown as ReturnType<typeof createServerClient>);
  });

  const createMockRequest = (pathname: string) => {
    const url = new URL(`https://example.com${pathname}`);
    const mockGetAll = vi.fn().mockReturnValue([]);
    const mockSet = vi.fn();

    return {
      nextUrl: {
        pathname,
        clone: () => new URL(url.toString()),
      },
      cookies: {
        getAll: mockGetAll,
        set: mockSet,
      },
    } as unknown as NextRequest;
  };

  it('should allow access to protected route if user is authenticated', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: { sub: '123' } }, error: null });
    const req = createMockRequest('/en/history');

    const response = await updateSession(req);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).not.toBe(307);
  });

  it('should redirect to home page if unauthenticated user tries to access protected route', async () => {
    mockGetClaims.mockResolvedValue({ data: null, error: null });
    const req = createMockRequest('/ru/history');

    const response = await updateSession(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/ru');
  });

  it('should redirect to localized home page if authenticated user tries to access auth routes', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: { sub: '123' } }, error: null });
    const req = createMockRequest('/en/sign-in');

    const response = await updateSession(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/en/');
  });

  it('should fallback to default locale if pathname has no matching locale', async () => {
    mockGetClaims.mockResolvedValue({ data: null, error: null });
    const req = createMockRequest('/history');

    const response = await updateSession(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/en');
  });

  it('should execute getAll and setAll cookie methods inside createServerClient config', async () => {
    mockGetClaims.mockResolvedValue({ data: null, error: null });
    const req = createMockRequest('/en/history');

    await updateSession(req);

    const clientArgs = vi.mocked(createServerClient).mock.calls[0][2];
    expect(clientArgs).toBeDefined();

    if (clientArgs?.cookies) {
      clientArgs.cookies.getAll();
      expect(req.cookies.getAll).toHaveBeenCalled();

      const mockCookiesToSet = [
        { name: 'sb-access-token', value: 'secret', options: { path: '/' } },
      ];

      const mockHeaders: Record<string, string> = { 'x-custom-header': 'test-value' };

      if (clientArgs.cookies.setAll) {
        clientArgs.cookies.setAll(mockCookiesToSet, mockHeaders);
        expect(req.cookies.set).toHaveBeenCalledWith('sb-access-token', 'secret');
      }
    }
  });
});
