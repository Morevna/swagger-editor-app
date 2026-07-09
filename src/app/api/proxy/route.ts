import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, path, method, parameters, body } = await req.json();

    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL is required' }, { status: 400 });
    }

    let finalPath = path;
    const queryParams = new URLSearchParams();
    const headers = new Headers();

    if (parameters) {
      parameters.forEach(
        (parameter: {
          name: string;
          in: 'path' | 'query' | 'header' | 'cookie';
          value: string;
        }) => {
          if (!parameter.value) return;

          switch (parameter.in) {
            case 'path':
              finalPath = finalPath.replace(
                `{${parameter.name}}`,
                encodeURIComponent(parameter.value)
              );
              break;

            case 'query':
              queryParams.append(parameter.name, parameter.value);
              break;

            case 'header':
              headers.append(parameter.name, parameter.value);
              break;

            case 'cookie': {
              const currentCookies = headers.get('Cookie');
              headers.set(
                'Cookie',
                currentCookies
                  ? `${currentCookies}; ${parameter.name}=${parameter.value}`
                  : `${parameter.name}=${parameter.value}`
              );
              break;
            }
          }
        }
      );
    }

    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    const queryString = queryParams.toString();
    const targetUrl = queryString
      ? `${cleanBaseUrl}${cleanPath}?${queryString}`
      : `${cleanBaseUrl}${cleanPath}`;

    headers.append('Content-Type', 'application/json');

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    const targetResponse = await fetch(targetUrl, fetchOptions);

    let responseData;
    const contentType = targetResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await targetResponse.json();
    } else {
      responseData = { message: await targetResponse.text() };
    }

    return NextResponse.json(responseData, {
      status: targetResponse.status,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Proxy error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
