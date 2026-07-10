import { ProxyResponse } from '@/components/viewer/types';
import { byteSize } from './byteSize';

export function estimateResponseSize(result: ProxyResponse) {
  const headersString = JSON.stringify(result.headers ?? {});
  return byteSize(result.body ?? '') + byteSize(headersString);
}
