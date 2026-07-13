import { beforeEach, describe, expect, it, vi } from 'vitest';
import { executeApiRequest } from './makeApiRequest';
import { API_ERROR_CODES } from '@/components/viewer/types';

const globalFetch = vi.fn<typeof fetch>();

vi.stubGlobal('fetch', globalFetch);

describe('executeApiRequest Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return URL_REQUIRED error if URL is not provided', async () => {
    const result = await executeApiRequest({
      url: '',
      method: 'GET',
    });

    expect(result).toEqual({
      success: false,
      body: '',
      errorCode: API_ERROR_CODES.URL_REQUIRED,
    });
    expect(globalFetch).not.toHaveBeenCalled();
  });

  it('should successfully execute GET request and pass headers', async () => {
    globalFetch.mockResolvedValueOnce(
      new Response('{"data": "success"}', {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    );

    const result = await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'GET',
      headers: { 'X-Custom-Header': 'hello' },
    });

    expect(globalFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      })
    );

    expect(result).toEqual({
      success: true,
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: '{"data": "success"}',
      errorDetails: null,
    });
  });

  it('should automatically add Content-Type and serialize body for POST requests', async () => {
    globalFetch.mockResolvedValueOnce(
      new Response('created', {
        status: 201,
      })
    );

    const result = await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'post',
      body: { foo: 'bar' },
    });

    const [, options] = globalFetch.mock.calls[0];

    expect(options?.method).toBe('POST');
    expect(options?.headers).toBeInstanceOf(Headers);

    const headers = options?.headers as Headers;

    expect(headers.get('Content-Type')).toBe('application/json');
    expect(options?.body).toBe('{"foo":"bar"}');
    expect(result.success).toBe(true);
  });

  it('should not overwrite existing Content-Type and should accept body as a string', async () => {
    globalFetch.mockResolvedValueOnce(new Response('ok'));

    await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: 'plain-string-body',
    });

    const [, options] = globalFetch.mock.calls[0];

    expect(options?.headers).toBeInstanceOf(Headers);

    const headers = options?.headers as Headers;

    expect(headers.get('Content-Type')).toBe('text/plain');
    expect(options?.body).toBe('plain-string-body');
  });

  it('should handle response body read error', async () => {
    const response = new Response();

    vi.spyOn(response, 'text').mockRejectedValueOnce(new Error('Read stream error'));

    globalFetch.mockResolvedValueOnce(response);

    const result = await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'GET',
    });

    expect(result.body).toBe('');
    expect(result.success).toBe(true);
  });

  it('should catch critical network errors and return FETCH_FAILED', async () => {
    globalFetch.mockRejectedValueOnce(new Error('Network connection failed'));

    const result = await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'GET',
    });

    expect(result).toEqual({
      success: false,
      body: 'Network connection failed',
      errorCode: API_ERROR_CODES.FETCH_FAILED,
    });
  });

  it('should correctly handle non-Error objects thrown in catch block', async () => {
    globalFetch.mockRejectedValueOnce('Some string error');

    const result = await executeApiRequest({
      url: 'https://api.example.com/test',
      method: 'GET',
    });

    expect(result.body).toBe('Some string error');
    expect(result.errorCode).toBe(API_ERROR_CODES.FETCH_FAILED);
  });
});
