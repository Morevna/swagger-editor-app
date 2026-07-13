import { describe, expect, it, vi } from 'vitest';
import { getSpec } from './getSpec';
import { SupabaseClient } from '@supabase/supabase-js';

describe('getSpec service', () => {
  it('should return content string when data is present', async () => {
    const mockMaybeSingle = vi
      .fn()
      .mockResolvedValue({ data: { content: 'swagger config json' }, error: null });
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    const mockSupabase = { from: mockFrom } as unknown as SupabaseClient;

    const result = await getSpec(mockSupabase, 'user-123');

    expect(mockFrom).toHaveBeenCalledWith('user_specs');
    expect(mockSelect).toHaveBeenCalledWith('content');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(result).toBe('swagger config json');
  });

  it('should return null if supabase returns an error', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') });
    const mockSupabase = {
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }) }),
    } as unknown as SupabaseClient;

    const result = await getSpec(mockSupabase, 'user-123');
    expect(result).toBeNull();
  });

  it('should return null if no records found', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSupabase = {
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }) }),
    } as unknown as SupabaseClient;

    const result = await getSpec(mockSupabase, 'user-123');
    expect(result).toBeNull();
  });
});
