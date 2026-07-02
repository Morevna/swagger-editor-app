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

export type StatusGroup = '2xx' | '3xx' | '4xx' | '5xx';

export type DateFilter = 'all' | 'today' | 'yesterday' | 'lastWeek' | 'lastMonth';
