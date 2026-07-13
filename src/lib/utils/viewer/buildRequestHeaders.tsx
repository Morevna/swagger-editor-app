import { Parameter } from '@/components/viewer/types';

export function buildRequestHeaders(
  parameters: Parameter[] | undefined,
  paramValues: Record<string, string>
) {
  const sendHeaders: Record<string, string> = {};

  parameters
    ?.filter((p) => p.in === 'header' && paramValues[p.name])
    .forEach((p) => {
      sendHeaders[p.name] = paramValues[p.name];
    });

  const cookieString = parameters
    ?.filter((p) => p.in === 'cookie' && paramValues[p.name])
    .map((p) => `${p.name}=${paramValues[p.name]}`)
    .join('; ');

  if (cookieString) {
    sendHeaders['Cookie'] = cookieString;
  }

  return sendHeaders;
}
