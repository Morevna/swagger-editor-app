import { StatusFilter } from '@/types/logs';
import { Row } from '@tanstack/react-table';
import { getStatusGroup } from './getStatusGroup';

export const statusFilterFn = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: StatusFilter
) => {
  const cellStatus: number = row.getValue(columnId);

  if (filterValue === 'allStatuses') return true;

  return filterValue === getStatusGroup(cellStatus);
};
