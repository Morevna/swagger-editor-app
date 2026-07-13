'use server';

import { createClient } from '@/lib/supabase/server';
import { executeApiRequest } from './makeApiRequest';
import { ProxyRequestArgs, ProxyResponse } from '@/components/viewer/types';
import { estimateRequestSize } from '../utils/size/estimateRequestSize';
import { estimateResponseSize } from '../utils/size/estimateResponseSize';

export async function executeAndLogRequest(args: ProxyRequestArgs): Promise<ProxyResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return await executeApiRequest(args);
  }

  const startedAt = performance.now();
  const startedAtIso = new Date().toISOString();

  const result = await executeApiRequest(args);

  const duration = Math.round(performance.now() - startedAt);
  const requestSize = estimateRequestSize(args);
  const responseSize = estimateResponseSize(result);

  const { error } = await supabase.from('user_history').insert({
    uid: user.id,
    method: args.method.toUpperCase(),
    endpoint: args.url,
    status: result.status,
    duration,
    requestSize,
    responseSize,
    errorDetails: result.errorDetails,
    time: startedAtIso,
  });

  if (error) {
    throw new Error(error.message);
  }

  return result;
}
