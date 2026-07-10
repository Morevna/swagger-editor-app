import { Parameter } from '@/components/viewer/types';

export const buildFinalUrl = (
  baseUrl: string,
  path: string,
  parameters: Parameter[],
  paramValues: Record<string, string>
) => {
  let computedPath = path;

  parameters
    ?.filter((p) => p.in === 'path')
    .forEach((p) => {
      if (paramValues[p.name]) {
        computedPath = computedPath.replace(`{${p.name}}`, encodeURIComponent(paramValues[p.name]));
      }
    });

  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = computedPath.startsWith('/') ? computedPath : `/${computedPath}`;

  const queryParams = new URLSearchParams();
  parameters
    ?.filter((p) => p.in === 'query')
    .forEach((p) => {
      if (paramValues[p.name]) queryParams.append(p.name, paramValues[p.name]);
    });

  const queryString = queryParams.toString();
  return queryString ? `${cleanBaseUrl}${cleanPath}?${queryString}` : `${cleanBaseUrl}${cleanPath}`;
};
