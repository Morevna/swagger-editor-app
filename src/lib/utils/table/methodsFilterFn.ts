import { MethodFilter } from '@/types/logs';
import { Row } from '@tanstack/react-table';

export const methodsFilterFn = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: MethodFilter
) => {
  const cellMethod: string = row.getValue(columnId);

  if (filterValue === 'allMethods') return true;

  return filterValue === cellMethod;
};
