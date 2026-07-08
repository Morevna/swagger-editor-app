'use client';

import React from 'react';
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
import { FilterType, FilterValue } from '@/types/logs';
import { FilterSidebar } from './FilterSidebar';
import { useColumns } from './columns';
import { PAGE_SIZE } from '@/constants/tableSizes';
import EmptyHistoryMessage from './EmptyHistoryMessage';

interface DataTableProps<TData> {
  data: TData[];
}

export default function HistoryTable<TData, TValue>({ data }: DataTableProps<TData>) {
  const t = useTranslations('HistoryPage');

  const columns = useColumns() as ColumnDef<TData, TValue>[];
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'time', desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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

  const handleFilter = (type: FilterType, filterValue: FilterValue) => {
    setColumnFilters((prev) => {
      const next = prev.filter((filter) => filter.id !== type);
      return [...next, { id: type, value: filterValue }];
    });
  };

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex size-full">
      <FilterSidebar onFilterChange={handleFilter} />
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

              <DropdownMenuContent className="min-w-35" align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        data-testid={column.id}
                      >
                        {t(column.id)}
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      data-testid="table-row"
                    >
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
