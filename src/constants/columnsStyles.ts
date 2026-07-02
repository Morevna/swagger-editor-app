import { Method, StatusGroup } from '@/types/logs';

export const METHOD_COLORS: Record<Method, string> = {
  GET: 'text-blue-600',
  POST: 'text-emerald-600',
  PUT: 'text-amber-600',
  DELETE: 'text-rose-600',
  PATCH: 'text-purple-600',
  HEAD: 'text-indigo-60',
  OPTIONS: 'text-cyan-600',
};

export const STATUS_GROUP_COLORS: Record<StatusGroup, string> = {
  '2xx': 'text-emerald-600',
  '3xx': 'text-blue-600',
  '4xx': 'text-amber-600',
  '5xx': 'text-rose-600',
};
