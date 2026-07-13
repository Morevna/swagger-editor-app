import { estimateRequestSize } from './estimateRequestSize';
import { ProxyRequestArgs } from '@/components/viewer/types';

describe('estimateRequestSize', () => {
  describe('basic request', () => {
    it('should calculate size for simple GET request without headers and body', () => {
      const args: ProxyRequestArgs = {
        url: 'https://example.com',
        method: 'GET',
      };

      expect(estimateRequestSize(args)).toBe(36);
    });

    it('should handle different HTTP methods', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'POST',
      };

      expect(estimateRequestSize(args)).toBe(39);
    });

    it('should convert method to uppercase', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com',
        method: 'get',
      };

      expect(estimateRequestSize(args)).toBe(32);
    });
  });

  describe('request with headers', () => {
    it('should calculate size with headers as plain object', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
      };

      expect(estimateRequestSize(args)).toBe(96);
    });

    it('should handle empty headers object', () => {
      const args: ProxyRequestArgs = {
        url: 'https://example.com',
        method: 'GET',
        headers: {},
      };

      expect(estimateRequestSize(args)).toBe(36);
    });
  });

  describe('request with body', () => {
    it('should calculate size with string body', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com',
        method: 'POST',
        body: '{"name":"test"}',
      };

      expect(estimateRequestSize(args)).toBe(48);
    });

    it('should calculate size with object body (JSON serialized)', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com',
        method: 'POST',
        body: { name: 'test', value: 123 },
      };
      expect(estimateRequestSize(args)).toBe(60);
    });

    it('should handle empty string body', () => {
      const args: ProxyRequestArgs = {
        url: 'https://example.com',
        method: 'POST',
        body: '',
      };

      expect(estimateRequestSize(args)).toBe(37);
    });
  });

  describe('complete request with headers and body', () => {
    it('should calculate full POST request size', () => {
      const args: ProxyRequestArgs = {
        url: 'https://api.com/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: { name: 'John', age: 30 },
      };

      expect(estimateRequestSize(args)).toBe(124);
    });
  });

  describe('UTF-8 encoding', () => {
    describe('edge cases', () => {
      it('should handle undefined headers', () => {
        const args: ProxyRequestArgs = {
          url: 'https://example.com',
          method: 'GET',
          headers: undefined,
        };

        expect(estimateRequestSize(args)).toBe(36);
      });

      it('should handle undefined body', () => {
        const args: ProxyRequestArgs = {
          url: 'https://example.com',
          method: 'POST',
          body: undefined,
        };

        expect(estimateRequestSize(args)).toBe(37);
      });

      it('should handle URL with query parameters', () => {
        const args: ProxyRequestArgs = {
          url: 'https://api.com/search?q=test&page=1',
          method: 'GET',
        };

        expect(estimateRequestSize(args)).toBe(53);
      });
    });
  });
});
