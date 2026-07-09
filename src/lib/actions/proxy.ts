'use server';

interface ProxyRequestArgs {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ProxyResponse {
  ok: boolean;
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
      return {
        ok: false,
        status: 400,
        headers: {},
        body: JSON.stringify({ error: 'URL is required' }),
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
      ok: targetResponse.ok,
      status: targetResponse.status,
      headers: targetHeaders,
      body: responseData,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      status: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Proxy integration error',
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}
