import { ProxyRequestArgs } from '@/components/viewer/types';
import { byteSize } from './byteSize';

export function estimateRequestSize(args: ProxyRequestArgs) {
  const headersString = JSON.stringify(args.headers ?? {});
  const bodyString =
    args.body === undefined
      ? ''
      : typeof args.body === 'string'
        ? args.body
        : JSON.stringify(args.body);

  return (
    byteSize(args.url) + byteSize(args.method) + byteSize(headersString) + byteSize(bodyString)
  );
}
