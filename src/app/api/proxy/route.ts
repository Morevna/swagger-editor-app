import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers: clientHeaders, body } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const headers = new Headers();

    if (clientHeaders) {
      Object.entries(clientHeaders).forEach(([key, val]) => {
        if (val) headers.append(key, val as string);
      });
    }

    if (body && !headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
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

    return NextResponse.json({
      status: targetResponse.status,
      headers: targetHeaders,
      body: responseData,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: 500,
        headers: {},
        body: JSON.stringify({
          error: 'Proxy error',
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 200 }
    );
  }
}
