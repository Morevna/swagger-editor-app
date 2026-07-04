import { HistoryTable } from '../../../components/HistoryTable/HistoryTable';
import { Suspense } from 'react';
import { SkeletonTable } from '../../../components/HistoryTable/SkeletonTable';
import { getLogs } from '@/services/getLogs';

export default function History() {
  const logsPromise = getLogs();

  return (
    <Suspense fallback={<SkeletonTable />}>
      <HistoryTable logsPromise={logsPromise} />
    </Suspense>
  );
}
