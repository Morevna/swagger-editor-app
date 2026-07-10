'use server';

import { API_ERROR_CODES, ApiErrorCode } from '../../components/viewer/types';

interface ProxyRequestArgs {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ProxyResponse {
  success: boolean;
  status?: number;
  headers?: Record<string, string>;
  body: string;
  errorCode?: ApiErrorCode;
}

export async function executeApiRequest({
  url,
  method,
  headers: clientHeaders,
  body,
}: ProxyRequestArgs): Promise<ProxyResponse> {
  try {
    if (!url) {
      return {
        success: false,
        body: '',
        errorCode: API_ERROR_CODES.URL_REQUIRED,
      };
    }

    const headers = new Headers(clientHeaders);
    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const targetResponse = await fetch(url, fetchOptions);

    let responseData: string;
    try {
      responseData = await targetResponse.text();
    } catch {
      responseData = '';
    }

    const targetHeaders: Record<string, string> = {};
    targetResponse.headers.forEach((val, key) => {
      targetHeaders[key] = val;
    });

    return {
      success: targetResponse.ok,
      status: targetResponse.status,
      headers: targetHeaders,
      body: responseData,
    };
  } catch (error: unknown) {
    return {
      success: false,
      body: error instanceof Error ? error.message : String(error),
      errorCode: API_ERROR_CODES.FETCH_FAILED,
    };
  }
}
