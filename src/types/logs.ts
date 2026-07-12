export type LogEntry = {
  method: Method;
  endpoint: string;
  status: number;
  duration: number;
  requestSize: number;
  responseSize: number;
  errorDetails: string | null;
  time: string;
};

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type StatusGroup = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

export type FilterType = 'time' | 'method' | 'status';

export type DateFilter = 'allTime' | 'today' | 'yesterday' | 'lastWeek' | 'lastMonth';

export type MethodFilter = Method | 'allMethods';

export type StatusFilter = StatusGroup | 'allStatuses';

export type FilterValue = DateFilter | MethodFilter | StatusFilter;
