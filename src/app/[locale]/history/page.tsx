import { HistoryTable } from '../../../components/HistoryTable/HistoryTable';
import { getLogs } from '@/services/getLogs';

export default async function History() {
  const logs = await getLogs();

  return <HistoryTable data={logs} />;
}
