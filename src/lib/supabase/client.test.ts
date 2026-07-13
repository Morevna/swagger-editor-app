import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from './client';
import { createBrowserClient } from '@supabase/ssr';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ supabase: 'browser_instance' })),
}));

describe('Supabase Browser Client', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb-key';
  });

  it('should initialize browser client with correct env variables', () => {
    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith('https://supabase.co', 'sb-key');
    expect(client).toEqual({ supabase: 'browser_instance' });
  });
});
