import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeAndLogRequest } from './executeAndLogRequest';
import { createClient } from '@/lib/supabase/server';
import { executeApiRequest } from './makeApiRequest';
import { estimateRequestSize } from '../utils/size/estimateRequestSize';
import { estimateResponseSize } from '../utils/size/estimateResponseSize';
import { ProxyRequestArgs, ProxyResponse } from '@/components/viewer/types';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('./makeApiRequest', () => ({
  executeApiRequest: vi.fn(),
}));

vi.mock('../utils/size/estimateRequestSize', () => ({
  estimateRequestSize: vi.fn(),
}));

vi.mock('../utils/size/estimateResponseSize', () => ({
  estimateResponseSize: vi.fn(),
}));

describe('executeAndLogRequest', () => {
  const mockInsert = vi.fn();
  const mockFrom = vi.fn(() => ({ insert: mockInsert }));
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
      },
      from: mockFrom,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    mockInsert.mockResolvedValue({ data: null, error: null });
  });

  describe('unauthorized user', () => {
    it('should execute request without logging when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: '{"users":[]}',
        headers: {},
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);

      const result = await executeAndLogRequest(args);

      expect(executeApiRequest).toHaveBeenCalledWith(args);
      expect(estimateRequestSize).not.toHaveBeenCalled();
      expect(estimateResponseSize).not.toHaveBeenCalled();
      expect(mockFrom).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('authorized user', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
    });

    it('should execute request, calculate sizes, and save to history', async () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'John' },
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 201,
        body: '{"id":1,"name":"John"}',
        headers: { 'content-type': 'application/json' },
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(150);
      vi.mocked(estimateResponseSize).mockReturnValue(75);

      const result = await executeAndLogRequest(args);

      expect(executeApiRequest).toHaveBeenCalledWith(args);
      expect(estimateRequestSize).toHaveBeenCalledWith(args);
      expect(estimateResponseSize).toHaveBeenCalledWith(mockResponse);

      expect(mockFrom).toHaveBeenCalledWith('user_history');
      expect(mockInsert).toHaveBeenCalledWith({
        uid: 'user-123',
        method: 'POST',
        endpoint: 'https://api.com/users',
        status: 201,
        duration: 0,
        requestSize: 150,
        responseSize: 75,
        errorDetails: undefined,
        time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should save error details when request fails', async () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'POST',
      };

      const mockResponse: ProxyResponse = {
        success: false,
        status: 400,
        body: '{"error":"Bad Request"}',
        headers: {},
        errorDetails: '{"error":"Bad Request"}',
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(100);
      vi.mocked(estimateResponseSize).mockReturnValue(50);

      await executeAndLogRequest(args);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          errorDetails: '{"error":"Bad Request"}',
          status: 400,
        })
      );
    });

    it('should measure duration correctly', async () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: 'OK',
        headers: {},
      };

      let callCount = 0;
      vi.spyOn(performance, 'now').mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1250; // 250ms duration
      });

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(50);
      vi.mocked(estimateResponseSize).mockReturnValue(30);

      await executeAndLogRequest(args);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 250,
        })
      );

      vi.restoreAllMocks();
    });

    it('should convert method to uppercase', async () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'get',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: 'OK',
        headers: {},
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(50);
      vi.mocked(estimateResponseSize).mockReturnValue(30);

      await executeAndLogRequest(args);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle request execution error', async () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockError = new Error('Network error');
      vi.mocked(executeApiRequest).mockRejectedValue(mockError);

      await expect(executeAndLogRequest(args)).rejects.toThrow('Network error');

      expect(estimateRequestSize).not.toHaveBeenCalled();
      expect(estimateResponseSize).not.toHaveBeenCalled();
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle request without headers', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: 'OK',
        headers: {},
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(50);
      vi.mocked(estimateResponseSize).mockReturnValue(30);

      await executeAndLogRequest(args);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          uid: 'user-123',
          method: 'GET',
          endpoint: 'https://api.com/users',
        })
      );
    });

    it('should handle response without error details', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: 'OK',
        headers: {},
        errorDetails: null,
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(50);
      vi.mocked(estimateResponseSize).mockReturnValue(30);

      await executeAndLogRequest(args);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          errorDetails: null,
        })
      );
    });

    it('should generate ISO timestamp for time field', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'GET',
      };

      const mockResponse: ProxyResponse = {
        success: true,
        status: 200,
        body: 'OK',
        headers: {},
      };

      vi.mocked(executeApiRequest).mockResolvedValue(mockResponse);
      vi.mocked(estimateRequestSize).mockReturnValue(50);
      vi.mocked(estimateResponseSize).mockReturnValue(30);

      await executeAndLogRequest(args);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // Verify it's a valid ISO date
      const date = new Date(insertCall.time);
      expect(date.getTime()).not.toBeNaN();
    });
  });
});
