import { Method, StatusGroup } from '@/types/logs';

export const METHOD_COLORS: Record<Method, string> = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
  PUT: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
  PATCH: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400',
  DELETE: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
  OPTIONS: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
  HEAD: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
};

export const STATUS_GROUP_COLORS: Record<StatusGroup, string> = {
  '1xx': 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400',
  '2xx':
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
  '3xx': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
  '4xx': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400',
  '5xx': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
};
