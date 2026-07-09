'use server';

interface ProxyRequestArgs {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ProxyResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export async function proxyRequest({
  url,
  method,
  headers: clientHeaders,
  body,
}: ProxyRequestArgs): Promise<ProxyResponse> {
  try {
    if (!url) {
      throw new Error('URL is required');
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
      status: targetResponse.status,
      headers: targetHeaders,
      body: responseData,
    };
  } catch (error: unknown) {
    return {
      status: 500,
      headers: {},
      body: JSON.stringify({
        error: 'Proxy error',
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}
