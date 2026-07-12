import { ProxyRequestArgs } from '@/components/viewer/types';
import { byteSize } from './byteSize';

export function estimateRequestSize(args: ProxyRequestArgs): number {
  let size = 0;

  const requestLine = `${args.method.toUpperCase()} ${args.url} HTTP/1.1\r\n`;
  size += byteSize(requestLine);

  if (args.headers) {
    if (args.headers instanceof Headers) {
      args.headers.forEach((value, key) => {
        size += byteSize(`${key}: ${value}\r\n`);
      });
    } else if (typeof args.headers === 'object') {
      Object.entries(args.headers).forEach(([key, value]) => {
        size += byteSize(`${key}: ${value}\r\n`);
      });
    }
  }

  size += 2;

  if (args.body !== undefined) {
    const bodyString = typeof args.body === 'string' ? args.body : JSON.stringify(args.body);
    size += byteSize(bodyString);
  }

  return size;
}
