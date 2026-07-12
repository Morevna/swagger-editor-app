import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getSpec(supabase: SupabaseClient, user_id: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_specs')
    .select('content')
    .eq('user_id', user_id)
    .maybeSingle();

  if (error || !data) return null;

  return data.content;
}
