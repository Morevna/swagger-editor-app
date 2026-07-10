'use client';

import { useTranslations } from 'next-intl';
import { Operation, StatusType } from '../types';
import { ResponseViewer } from '../ResponseViewer';

interface ResponsesTabProps {
  operation: Operation;
  response: StatusType;
}

export default function ResponsesTab({ operation, response }: ResponsesTabProps) {
  const t = useTranslations('Viewer');

  return (
    <>
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
                      <p className="mb-1 text-xs font-semibold text-zinc-500">{t('contentType')}</p>
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
                        <p className="mb-1 text-xs font-semibold text-zinc-500">{t('schema')}</p>
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
                        <p className="mb-1 text-xs font-semibold text-zinc-500">{t('example')}</p>
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
    </>
  );
}
