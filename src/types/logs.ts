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
