'use client';

import React, { use } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { DateFilter } from '@/types/logs';
import { DateFilterSidebar } from './DateFilterSidebar';
import { useColumns } from './columns';
import { PAGE_SIZE } from '@/constants/historyTable';
import EmptyHistoryMessage from './emptyHistoryMessage';

interface DataTableProps<TData> {
  logsPromise: Promise<TData[]>;
}

export function HistoryTable<TData, TValue>({ logsPromise }: DataTableProps<TData>) {
  const t = useTranslations('HistoryPage');
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'time', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const columns = useColumns() as ColumnDef<TData, TValue>[];

  const data = use(logsPromise);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE || 10,
      },
    },
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const handleDateFilter = (filterValue: DateFilter) => {
    setColumnFilters([{ id: 'time', value: filterValue }]);
  };

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex size-full">
      <DateFilterSidebar onFilterChange={handleDateFilter} />

      {data.length === 0 ? (
        <EmptyHistoryMessage />
      ) : (
        <div className="flex w-full grow flex-col px-6">
          <div className="flex items-center py-4">
            <h2 className="font-bold">{t('title')}</h2>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {t('columns')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full grow overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 w-full text-center">
                      {t('noResults')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <p>
              Page {pageCount === 0 ? 0 : currentPage + 1} of {pageCount}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t('previous')}
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t('next')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
