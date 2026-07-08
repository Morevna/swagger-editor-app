export const tablefilters = [
  {
    type: 'time',
    header: 'dataFilterHeader',
    options: ['allTime', 'today', 'yesterday', 'lastWeek', 'lastMonth'],
  },
  {
    type: 'method',
    header: 'methodFilterHeader',
    options: ['allMethods', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  },
  {
    type: 'status',
    header: 'statusFilterHeader',
    options: ['allStatuses', '1xx', '2xx', '3xx', '4xx', '5xx'],
  },
] as const;
