import { Skeleton } from '@/components/ui/skeleton';
import { SKELETON_SIDEBAR_ROWS, SKELETON_COLUMNS, SKELETON_ROWS } from '@/constants/tableSizes';

export function SkeletonTable() {
  return (
    <div data-testid="skeleton-table" className="flex size-full">
      <div className="flex w-1/5 flex-col gap-6 border-r px-6 py-4">
        <Skeleton className="h-10 w-32" />
        <div data-testid="skeleton-sidebar" className="flex flex-col gap-2">
          {Array.from({ length: SKELETON_SIDEBAR_ROWS }).map((_, index) => (
            <Skeleton key={index} data-testid="skeleton-sidebar-row" className="h-12 w-full" />
          ))}
        </div>
      </div>

      <div className="flex w-full grow flex-col px-6">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="ml-auto h-10 w-24" />
        </div>

        <div className="w-full grow overflow-hidden rounded-xl">
          <div className="flex w-full flex-col gap-3 p-4">
            <div data-testid="skeleton-table-header" className="mb-2 flex gap-6 border-b pb-4">
              {Array.from({ length: SKELETON_COLUMNS }).map((_, index) => (
                <Skeleton
                  key={`header-${index}`}
                  data-testid="skeleton-table-header-cell"
                  className="h-6 flex-1 px-3 py-5"
                />
              ))}
            </div>

            {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} data-testid="skeleton-table-row" className="flex gap-6">
                {Array.from({ length: SKELETON_COLUMNS }).map((_, colIndex) => (
                  <Skeleton
                    key={`cell-${rowIndex}-${colIndex}`}
                    data-testid="skeleton-table-cell"
                    className="h-6 flex-1 px-3 py-5"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
