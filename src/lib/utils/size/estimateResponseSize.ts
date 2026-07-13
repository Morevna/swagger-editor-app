import { ProxyResponse } from '@/components/viewer/types';
import { byteSize } from './byteSize';

export function estimateResponseSize(result: ProxyResponse): number {
  let size = byteSize(result.body ?? '');

  if (result.headers) {
    Object.entries(result.headers).forEach(([key, value]) => {
      size += byteSize(`${key}: ${value}`);
    });
  }

  return size;
}
