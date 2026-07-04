import { createClient } from '@/lib/supabase/server';
import { LogEntry } from '@/types/logs';

const MOCK_UID = 'f26fbcce-13e8-4edc-93a1-4b22592276b1';

export async function getLogs(): Promise<LogEntry[]> {
  const supabase = await createClient();
  const { data: logs, error } = await supabase.from('user_history').select('*').eq('uid', MOCK_UID);

  if (error) {
    throw new Error(`Error loading data: ${error.message}`);
  }
  return logs;
}
