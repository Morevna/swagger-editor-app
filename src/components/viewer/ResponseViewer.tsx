'use client';

interface ResponseViewerProps {
  status: number;
  headers: string;
  body: string;
}

export function ResponseViewer({ status, headers, body }: ResponseViewerProps) {
  const isSuccess = status >= 200 && status < 300;

  return (
    <div
      className="
      mt-6 space-y-4 border-t border-zinc-200 pt-4
      dark:border-zinc-800
    "
    >
      <h3
        className="
        text-sm font-semibold text-zinc-800
        dark:text-zinc-200
      "
      >
        Response
      </h3>

      <div className="flex items-center gap-2">
        <span
          className="
          text-xs font-medium text-zinc-500
          dark:text-zinc-400
        "
        >
          Status Code:
        </span>
        <span
          className={`
          rounded-sm px-2 py-0.5 font-mono text-xs font-bold
          ${
            isSuccess
              ? `
            bg-emerald-100 text-emerald-700
            dark:bg-emerald-950 dark:text-emerald-400
          `
              : `
            bg-red-100 text-red-700
            dark:bg-red-950 dark:text-red-400
          `
          }
        `}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <span
          className="
          text-xs font-medium text-zinc-500
          dark:text-zinc-400
        "
        >
          Response Body
        </span>
        <pre
          className="
          max-h-[250px] overflow-auto rounded-md bg-zinc-900 p-3 font-mono text-xs text-zinc-100
          dark:bg-zinc-950
        "
        >
          {body || 'Empty response body'}
        </pre>
      </div>

      {headers && (
        <div className="space-y-2">
          <span
            className="
            text-xs font-medium text-zinc-500
            dark:text-zinc-400
          "
          >
            Response Headers
          </span>
          <pre
            className="
            max-h-[150px] overflow-auto rounded-md bg-zinc-100 p-3 font-mono text-[11px]
            text-zinc-600
            dark:bg-zinc-900 dark:text-zinc-400
          "
          >
            {headers}
          </pre>
        </div>
      )}
    </div>
  );
}
