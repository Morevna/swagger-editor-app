'use client';

import { Button } from '@/components/ui/Button';
import { METHOD_COLORS, STATUS_GROUP_COLORS } from '@/constants/columnsStyles';
import { dateFilterFn } from '@/lib/utils/dateFilterFn';
import { formatDateTime } from '@/lib/utils/formatDateTime';
import { formatSize } from '@/lib/utils/formatSize';
import { getStatusGroup } from '@/lib/utils/getStatusGroup';
import { LogEntry, Method } from '@/types/logs';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export const useColumns = (): ColumnDef<LogEntry>[] => {
  const t = useTranslations('HistoryPage');
  const locale = useLocale();

  return [
    {
      accessorKey: 'method',
      header: t('method'),
      cell: ({ row }) => {
        const method = row.getValue('method') as Method;
        const styles = METHOD_COLORS[method];
        return (
          <span
            className={`
              font-bold
              ${styles}
            `}
          >
            {method}
          </span>
        );
      },
    },
    {
      accessorKey: 'endpoint',
      header: t('endpoint'),
      cell: ({ row }) => {
        const text = row.getValue('endpoint') as string;
        return <div className="wrap-anywhere">{text}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as number;
        const group = getStatusGroup(status);
        const styles = STATUS_GROUP_COLORS[group];
        return (
          <span
            className={`
              font-bold
              ${styles}
            `}
          >
            {status}
          </span>
        );
      },
    },

    {
      accessorKey: 'duration',
      header: t('duration'),
      cell: ({ row }) => {
        const duration = row.getValue('duration');
        return duration + ' ms';
      },
    },
    {
      accessorKey: 'requestSize',
      header: t('requestSize'),
      cell: ({ row }) => {
        const requestSize = row.getValue('requestSize') as number;
        return formatSize(requestSize);
      },
    },
    {
      accessorKey: 'responseSize',
      header: t('responseSize'),
      cell: ({ row }) => {
        const responseSize = row.getValue('requestSize') as number;
        return formatSize(responseSize);
      },
    },
    {
      accessorKey: 'errorDetails',
      header: t('errorDetails'),
      cell: ({ row }) => {
        const text = row.getValue('errorDetails') as string;
        return <div className="max-w-75 wrap-break-word">{text}</div>;
      },
    },
    {
      accessorKey: 'time',
      filterFn: dateFilterFn,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('time')}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDateTime(row.getValue('time'), locale),
    },
  ];
};
