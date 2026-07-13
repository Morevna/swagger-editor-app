import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLogs } from './getLogs';
import { createClient } from '@/lib/supabase/server';
import { MOCK_LOGS } from '@/lib/mocks/logs';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('getLogs', () => {
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockSelect.mockReturnValue({ eq: mockEq });

    const mockClient = {
      auth: {
        getUser: mockGetUser,
      },
      from: mockFrom,
    } as unknown as Awaited<ReturnType<typeof createClient>>;

    vi.mocked(createClient).mockResolvedValue(mockClient);
  });

  const mockUserId = 'test-user-123';

  describe('successful data retrieval', () => {
    it('should return logs for authenticated user', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: MOCK_LOGS,
        error: null,
      });

      const result = await getLogs();

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('user_history');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('uid', mockUserId);
      expect(result).toEqual(MOCK_LOGS);
      expect(result).toHaveLength(MOCK_LOGS.length);
    });

    it('should return empty array when user has no logs', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await getLogs();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should filter logs by correct user id', async () => {
      const differentUserId = 'another-user-456';

      mockGetUser.mockResolvedValue({
        data: { user: { id: differentUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: [],
        error: null,
      });

      await getLogs();

      expect(mockEq).toHaveBeenCalledWith('uid', differentUserId);
    });

    it('should return logs with all required fields', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: MOCK_LOGS,
        error: null,
      });

      const result = await getLogs();

      result.forEach((log) => {
        expect(log).toMatchObject({
          method: expect.any(String),
          endpoint: expect.any(String),
          status: expect.any(Number),
          duration: expect.any(Number),
          requestSize: expect.any(Number),
          responseSize: expect.any(Number),
          time: expect.any(String),
        });
      });
    });

    it('should preserve logs with error details', async () => {
      const logsWithErrors = MOCK_LOGS.filter((log) => log.errorDetails !== null);

      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: logsWithErrors,
        error: null,
      });

      const result = await getLogs();

      expect(result).toEqual(logsWithErrors);
      result.forEach((log) => {
        expect(log.errorDetails).not.toBeNull();
      });
    });
  });

  describe('authentication errors', () => {
    it('should throw error when auth returns error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Auth session missing' },
      });

      await expect(getLogs()).rejects.toThrow('User not authenticated');
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should throw error when user is null', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(getLogs()).rejects.toThrow('User not authenticated');
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should throw error when both authError and user are present', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      await expect(getLogs()).rejects.toThrow('User not authenticated');
    });
  });

  describe('database errors', () => {
    it('should throw error when database query fails', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      });

      await expect(getLogs()).rejects.toThrow('Error loading data: Database connection failed');
    });

    it('should include original error message in thrown error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: null,
        error: { message: 'Table not found' },
      });

      await expect(getLogs()).rejects.toThrow('Error loading data: Table not found');
    });

    it('should return empty array when data is null but no error provided', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });

      mockEq.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await getLogs();
      expect(result).toEqual(null);
    });
  });
});
