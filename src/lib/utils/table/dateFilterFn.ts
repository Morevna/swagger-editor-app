import { DateFilter } from '@/types/logs';
import { Row } from '@tanstack/react-table';

export const dateFilterFn = <TData>(row: Row<TData>, columnId: string, filterValue: DateFilter) => {
  const cellDate = new Date(row.getValue(columnId));
  const today = new Date();

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  switch (filterValue) {
    case 'all':
      return true;
    case 'today':
      return cellDate >= startOfToday;
    case 'yesterday':
      return cellDate >= startOfYesterday && cellDate < startOfToday;
    case 'lastWeek':
      return cellDate >= startOfWeek;
    case 'lastMonth':
      return cellDate >= startOfMonth;
    default:
      return true;
  }
};
