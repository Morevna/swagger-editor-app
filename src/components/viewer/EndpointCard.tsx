'use client';

import { Operation } from './types';

interface EndpointCardProps {
  path: string;
  method: string;
  operation: Operation;
}

export default function EndpointCard({ path, method, operation }: EndpointCardProps) {
  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 text-xl font-semibold uppercase">
        {method} {path}
      </h2>

      <section className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-zinc-500">Summary</h3>

        <p className="text-sm">{operation.summary || 'No summary'}</p>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-zinc-500">Description</h3>

        <p className="text-sm whitespace-pre-wrap text-zinc-600">
          {operation.description || 'No description'}
        </p>
      </section>
    </div>
  );
}
