'use server';

import { API_ERROR_CODES, ProxyRequestArgs, ProxyResponse } from '../../components/viewer/types';

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

    let errorDetails = null;
    if (!targetResponse.ok) {
      errorDetails = responseData;
    }

    return {
      success: targetResponse.ok,
      status: targetResponse.status,
      headers: targetHeaders,
      body: responseData,
      errorDetails: errorDetails,
    };
  } catch (error: unknown) {
    return {
      success: false,
      body: error instanceof Error ? error.message : String(error),
      errorCode: API_ERROR_CODES.FETCH_FAILED,
    };
  }
}
