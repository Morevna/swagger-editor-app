'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Operation, Parameter } from './types';
import { ParameterRow } from './ParameterRow';
import { RequestBodyEditor } from './RequestBodyEditor';
import { ResponseViewer } from './ResponseViewer';
import { useTranslations } from 'next-intl';
import { executeApiRequest } from '@/lib/actions/makeApiRequest';

interface EndpointDetailsProps {
  path: string;
  method: string;
  operation: Operation;
  baseUrl: string;
}

const methodColors: Record<string, string> = {
  get: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
  post: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
  put: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
  patch: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400',
  delete: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
  options: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
  head: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
};

const buildFinalUrl = (
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

export default function EndpointDetails({
  path,
  method,
  operation,
  baseUrl,
}: EndpointDetailsProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    headers: string;
    body: string;
  } | null>(null);

  const t = useTranslations('Viewer');

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateCurl = () => {
    const finalUrl = buildFinalUrl(baseUrl, path, operation.parameters || [], paramValues);
    let curl = `curl -X ${method.toUpperCase()} "${finalUrl}"`;

    operation.parameters
      ?.filter((p) => p.in === 'header')
      .forEach((p) => {
        if (paramValues[p.name]) {
          curl += ` \\\n  -H "${p.name}: ${paramValues[p.name]}"`;
        }
      });

    const cookies = operation.parameters
      ?.filter((p) => p.in === 'cookie' && paramValues[p.name])
      .map((p) => `${p.name}=${paramValues[p.name]}`)
      .join('; ');

    if (cookies) {
      curl += ` \\\n  -H "Cookie: ${cookies}"`;
    }

    if (bodyValue) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyValue.replace(/'/g, "'\\''")}'`;
    }

    navigator.clipboard.writeText(curl);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const finalUrl = buildFinalUrl(baseUrl, path, operation.parameters || [], paramValues);

      const sendHeaders: Record<string, string> = {};
      operation.parameters
        ?.filter((p) => p.in === 'header' && paramValues[p.name])
        .forEach((p) => {
          sendHeaders[p.name] = paramValues[p.name];
        });

      const cookieString = operation.parameters
        ?.filter((p) => p.in === 'cookie' && paramValues[p.name])
        .map((p) => `${p.name}=${paramValues[p.name]}`)
        .join('; ');

      if (cookieString) {
        sendHeaders['Cookie'] = cookieString;
      }

      let parsedBody: unknown = undefined;
      if (bodyValue) {
        try {
          parsedBody = JSON.parse(bodyValue);
        } catch {
          setResponse({
            status: 400,
            headers: '',
            body: t('invalidJson'),
          });
          setLoading(false);
          return;
        }
      }

      const data = await executeApiRequest({
        url: finalUrl,
        method,
        headers: sendHeaders,
        body: parsedBody,
      });

      let formattedBody = data.body;

      if (data.errorCode) {
        setResponse({
          status: 502,
          headers: '{"Content-Type": "application/json"}',
          body: JSON.stringify({ error: 'Proxy integration error', details: data.body }, null, 2),
        });
        return;
      }

      try {
        formattedBody = JSON.stringify(JSON.parse(data.body), null, 2);
      } catch {}

      setResponse({
        status: data.status || 200,
        headers: JSON.stringify(data.headers, null, 2),
        body: formattedBody || t('emptyBody'),
      });
    } catch (err: unknown) {
      setResponse({
        status: 500,
        headers: '',
        body: err instanceof Error ? err.message : t('proxyError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const methodLower = method.toLowerCase();
  const badgeColor = methodColors[methodLower] || methodColors.get;

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="details" className="flex flex-1 flex-col">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="parameters">{t('parameters')}</TabsTrigger>
          <TabsTrigger value="body">{t('requestBody')}</TabsTrigger>
          <TabsTrigger value="responses">{t('responses')}</TabsTrigger>
        </TabsList>

        <div
          className="
            mb-6 flex items-center justify-between border-b border-zinc-100 pb-4
            dark:border-zinc-800
          "
        >
          <div className="flex items-center gap-3">
            <span
              className={`
                rounded-sm border px-2 py-1 text-xs font-semibold uppercase
                ${badgeColor}
              `}
            >
              {method}
            </span>
            <h2
              className="
                text-lg font-semibold text-zinc-900
                dark:text-zinc-100
              "
            >
              {path}
            </h2>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleGenerateCurl}>
              {t('curl')}
            </Button>
            <Button size="sm" onClick={handleExecute} disabled={loading}>
              {loading ? t('executing') : t('try')}
            </Button>
          </div>
        </div>

        <TabsContent value="details">
          <div className="space-y-6">
            <div>
              <h3
                className="
                  mb-2 text-sm font-semibold text-zinc-700
                  dark:text-zinc-300
                "
              >
                {t('summary')}
              </h3>
              <p
                className="
                  text-sm text-zinc-600
                  dark:text-zinc-400
                "
              >
                {operation.summary || t('noSummary')}
              </p>
            </div>
            <div>
              <h3
                className="
                  mb-2 text-sm font-semibold text-zinc-700
                  dark:text-zinc-300
                "
              >
                {t('description')}
              </h3>
              <p
                className="
                  text-sm whitespace-pre-wrap text-zinc-600
                  dark:text-zinc-400
                "
              >
                {operation.description || t('noDescription')}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="parameters">
          {operation.parameters?.length ? (
            <div className="space-y-4">
              {operation.parameters.map((parameter) => (
                <ParameterRow
                  key={`${parameter.in}-${parameter.name}`}
                  parameter={parameter}
                  value={paramValues[parameter.name] || ''}
                  onChange={(val) => handleParamChange(parameter.name, val)}
                />
              ))}
            </div>
          ) : (
            <p
              className="
                text-sm text-zinc-500
                dark:text-zinc-400
              "
            >
              {t('noParameters')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="body">
          {operation.requestBody ? (
            <RequestBodyEditor
              requestBody={operation.requestBody}
              value={bodyValue}
              onChange={setBodyValue}
            />
          ) : (
            <p
              className="
                text-sm text-zinc-500
                dark:text-zinc-400
              "
            >
              {t('noRequestBody')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="responses">
          {operation.responses ? (
            <div className="space-y-4">
              {Object.entries(operation.responses).map(([status, response]) => (
                <div
                  key={status}
                  className="
                    rounded-md border border-zinc-200 bg-white p-4
                    dark:border-zinc-800 dark:bg-zinc-900
                  "
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        font-mono text-sm font-semibold
                        ${status.startsWith('2') ? 'text-emerald-600' : 'text-red-500'}
                      `}
                    >
                      {status}
                    </span>

                    <div
                      className="
                        text-sm font-medium text-zinc-800
                        dark:text-zinc-200
                      "
                    >
                      {response.description}
                    </div>
                  </div>

                  {response.content &&
                    Object.entries(response.content).map(([contentType, content]) => (
                      <div key={contentType} className="mt-4 space-y-3">
                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-500">
                            {t('contentType')}
                          </p>
                          <pre
                            className="
                              rounded-sm bg-zinc-100 p-2 text-xs
                              dark:bg-zinc-800
                            "
                          >
                            {contentType}
                          </pre>
                        </div>

                        {content.schema && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-500">
                              {t('schema')}
                            </p>
                            <pre
                              className="
                                overflow-auto rounded-sm bg-zinc-100 p-2 text-xs
                                dark:bg-zinc-800
                              "
                            >
                              {JSON.stringify(content.schema, null, 2)}
                            </pre>
                          </div>
                        )}

                        {content.example && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-500">
                              {t('example')}
                            </p>
                            <pre
                              className="
                                overflow-auto rounded-sm bg-zinc-100 p-2 text-xs
                                dark:bg-zinc-800
                              "
                            >
                              {JSON.stringify(content.example, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}

              {response && (
                <div className="mt-6">
                  <ResponseViewer
                    status={response.status}
                    headers={response.headers}
                    body={response.body}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p
                className="
                  text-sm text-zinc-500
                  dark:text-zinc-400
                "
              >
                {t('noResponses')}
              </p>
              {response && (
                <div className="mt-6">
                  <ResponseViewer
                    status={response.status}
                    headers={response.headers}
                    body={response.body}
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
