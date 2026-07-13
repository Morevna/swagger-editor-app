'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Operation, StatusType } from './types';
import { useTranslations } from 'next-intl';
import { METHOD_COLORS } from '@/constants/columnsStyles';
import { buildFinalUrl } from '@/lib/utils/viewer/buildFinalUrl';
import { generateCurl } from '@/lib/utils/viewer/generateCurl';
import { Method } from '@/types/logs';
import { Badge } from '../ui/badge';
import ParametersTab from './details-tabs/ParametersTab';
import BodyTab from './details-tabs/BodyTab';
import ResponsesTab from './details-tabs/ResponsesTab';
import DetailsTab from './details-tabs/DetailsTab';
import { buildRequestHeaders } from '@/lib/utils/viewer/buildRequestHeaders';
import { executeAndLogRequest } from '@/lib/actions/executeAndLogRequest';

interface EndpointDetailsProps {
  path: string;
  method: string;
  operation: Operation;
  baseUrl: string;
}

export default function EndpointDetails({
  path,
  method,
  operation,
  baseUrl,
}: EndpointDetailsProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StatusType>(null);

  const t = useTranslations('Viewer');

  const handleParamChange = useCallback((name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBodyValueChange = useCallback((value: string) => {
    setBodyValue(value);
  }, []);

  const handleGenerateCurl = () => {
    const finalUrl = buildFinalUrl(baseUrl, path, operation.parameters || [], paramValues);
    const curl = generateCurl(method, operation, finalUrl, paramValues, bodyValue);
    navigator.clipboard.writeText(curl);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const finalUrl = buildFinalUrl(baseUrl, path, operation.parameters || [], paramValues);
      const sendHeaders = buildRequestHeaders(operation.parameters, paramValues);

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

      const data = await executeAndLogRequest({
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

  const badgeColor = METHOD_COLORS[method.toUpperCase() as Method];

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
            <Badge
              className={`
                ${badgeColor}
              `}
            >
              {method}
            </Badge>
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
          <DetailsTab operation={operation} />
        </TabsContent>

        <TabsContent value="parameters">
          <ParametersTab
            operation={operation}
            paramValues={paramValues}
            handleParamChange={handleParamChange}
          />
        </TabsContent>

        <TabsContent value="body">
          <BodyTab
            operation={operation}
            bodyValue={bodyValue}
            handleBodyValueChange={handleBodyValueChange}
          />
        </TabsContent>

        <TabsContent value="responses">
          <ResponsesTab operation={operation} response={response} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
