import { createClient } from '@/lib/supabase/server';
import { LogEntry } from '@/types/logs';

export async function getLogs(): Promise<LogEntry[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: logs, error } = await supabase.from('user_history').select('*').eq('uid', user?.id);

  if (error) {
    throw new Error(`Error loading data: ${error.message}`);
  }
  return logs;
}
