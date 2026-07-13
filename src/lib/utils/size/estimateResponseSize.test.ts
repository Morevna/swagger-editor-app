import { estimateResponseSize } from './estimateResponseSize';
import { ProxyResponse } from '@/components/viewer/types';

describe('estimateResponseSize', () => {
  it('should calculate size for a response with only body', () => {
    const result: ProxyResponse = {
      success: true,
      body: 'Hello, World!',
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(13);
  });

  it('should include headers in the size calculation', () => {
    const result: ProxyResponse = {
      success: true,
      body: '{"status":"ok"}',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '15',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(63);
  });

  it('should handle empty body', () => {
    const result: ProxyResponse = {
      success: true,

      body: '',
      headers: {
        'Content-Type': 'text/plain',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(24);
  });

  it('should handle undefined body', () => {
    const result: ProxyResponse = {
      success: true,
      body: '',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(30);
  });

  it('should handle multiple headers', () => {
    const result: ProxyResponse = {
      success: true,

      body: 'Success',
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'X-Custom-Header': 'custom-value',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(82);
  });

  it('should handle empty headers', () => {
    const result: ProxyResponse = {
      success: true,

      body: 'Response data',
      headers: {},
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(13);
  });

  it('should handle undefined headers', () => {
    const result: ProxyResponse = {
      success: true,

      body: 'Response data',
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(13);
  });

  it('should handle body with special characters', () => {
    const result: ProxyResponse = {
      success: true,

      body: 'Hello\nWorld!\tTab',
      headers: {
        'Content-Type': 'text/plain',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(40);
  });

  it('should handle empty response with no body and no headers', () => {
    const result: ProxyResponse = {
      success: false,
      body: '',
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(0);
  });

  it('should handle header values with colons and special characters', () => {
    const result: ProxyResponse = {
      success: true,
      body: 'OK',
      headers: {
        'X-Custom': 'value:with:colons',
        Location: 'https://example.com/path?query=value',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(75);
  });

  it('should correctly count bytes for UTF-8 characters', () => {
    const result: ProxyResponse = {
      success: true,

      body: 'Привет мир',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(58);
  });

  it('should handle large response body', () => {
    const largeBody = 'x'.repeat(1000);
    const result: ProxyResponse = {
      success: true,

      body: largeBody,
      headers: {
        'Content-Type': 'text/plain',
      },
    };

    const size = estimateResponseSize(result);
    expect(size).toBe(1024);
  });
});
