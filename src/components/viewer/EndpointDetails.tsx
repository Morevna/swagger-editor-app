'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Operation } from './types';
import { ParameterRow } from './ParameterRow';
import { RequestBodyEditor } from './RequestBodyEditor';
import { ResponseViewer } from './ResponseViewer';

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

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateCurl = () => {
    let computedPath = path;

    operation.parameters
      ?.filter((p) => p.in === 'path')
      .forEach((p) => {
        if (paramValues[p.name]) {
          computedPath = computedPath.replace(`{${p.name}}`, paramValues[p.name]);
        }
      });

    const queryParams = operation.parameters
      ?.filter((p) => p.in === 'query')
      .map((p) =>
        paramValues[p.name] ? `${p.name}=${encodeURIComponent(paramValues[p.name])}` : ''
      )
      .filter(Boolean)
      .join('&');

    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = computedPath.startsWith('/') ? computedPath : `/${computedPath}`;
    const finalUrl = queryParams
      ? `${cleanBaseUrl}${cleanPath}?${queryParams}`
      : `${cleanBaseUrl}${cleanPath}`;

    let curl = `curl -X ${method.toUpperCase()} "${finalUrl}"`;

    operation.parameters
      ?.filter((p) => p.in === 'header')
      .forEach((p) => {
        if (paramValues[p.name]) {
          curl += ` \\\n  -H "${p.name}: ${paramValues[p.name]}"`;
        }
      });

    if (bodyValue) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyValue.replace(/'/g, "'\\''")}'`;
    }

    navigator.clipboard.writeText(curl);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl,
          path,
          method,
          parameters: paramValues,
          body: bodyValue ? JSON.parse(bodyValue) : undefined,
        }),
      });

      const data = await res.json();

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      setResponse({
        status: res.status,
        headers: JSON.stringify(responseHeaders, null, 2),
        body: JSON.stringify(data, null, 2),
      });
    } catch (err: unknown) {
      setResponse({
        status: 500,
        headers: '',
        body: err instanceof Error ? err.message : 'Unknown Error during proxy request',
      });
    } finally {
      setLoading(false);
    }
  };

  const methodLower = method.toLowerCase();
  const badgeColor = methodColors[methodLower] || methodColors.get;

  return (
    <div className="flex h-full flex-col">
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
            Code cURL
          </Button>
          <Button size="sm" onClick={handleExecute} disabled={loading}>
            {loading ? 'Executing...' : 'Try it out'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="flex flex-1 flex-col">
        <TabsList className="mb-6 w-fit">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="body">Request Body</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="space-y-6">
            <div>
              <h3
                className="
                mb-2 text-sm font-semibold text-zinc-700
                dark:text-zinc-300
              "
              >
                Summary
              </h3>
              <p
                className="
                text-sm text-zinc-600
                dark:text-zinc-400
              "
              >
                {operation.summary || 'No summary'}
              </p>
            </div>
            <div>
              <h3
                className="
                mb-2 text-sm font-semibold text-zinc-700
                dark:text-zinc-300
              "
              >
                Description
              </h3>
              <p
                className="
                text-sm whitespace-pre-wrap text-zinc-600
                dark:text-zinc-400
              "
              >
                {operation.description || 'No description'}
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
              No parameters
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
              No request body
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
                        ${status.startsWith('2') ? `text-emerald-600` : `text-red-500`}
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
                </div>
              ))}
            </div>
          ) : (
            <p
              className="
              text-sm text-zinc-500
              dark:text-zinc-400
            "
            >
              No responses
            </p>
          )}
        </TabsContent>
      </Tabs>

      {response && (
        <ResponseViewer status={response.status} headers={response.headers} body={response.body} />
      )}
    </div>
  );
}
