'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const saveSpecSchema = z.object({
  content: z.string().max(20000),
});

export async function saveSpec(content: string): Promise<{ error: string | null }> {
  const parsed = saveSpecSchema.safeParse({ content });
  if (!parsed.success) {
    return { error: 'INVALID_PAYLOAD' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'UNAUTHENTICATED' };
  }

  const { error: dbError } = await supabase
    .from('user_specs')
    .upsert(
      { user_id: user.id, content: parsed.data.content, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (dbError) {
    return { error: 'SAVE_FAILED' };
  }

  return { error: null };
}
