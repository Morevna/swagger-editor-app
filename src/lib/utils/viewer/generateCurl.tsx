import { Operation } from '@/components/viewer/types';

export const generateCurl = (
  method: string,
  currentOperation: Operation,
  finalUrl: string,
  paramValues: Record<string, string>,
  bodyValue: string
) => {
  let curl = `curl -X ${method.toUpperCase()} "${finalUrl}"`;

  currentOperation.parameters
    ?.filter((p) => p.in === 'header')
    .forEach((p) => {
      if (paramValues[p.name]) {
        curl += ` \\\n  -H "${p.name}: ${paramValues[p.name]}"`;
      }
    });

  const cookies = currentOperation.parameters
    ?.filter((p) => p.in === 'cookie' && paramValues[p.name])
    .map((p) => `${p.name}=${paramValues[p.name]}`)
    .join('; ');

  if (cookies) {
    curl += ` \\\n  -H "Cookie: ${cookies}"`;
  }

  if (bodyValue) {
    curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyValue.replace(/'/g, "'\\''")}'`;
  }

  return curl;
};
