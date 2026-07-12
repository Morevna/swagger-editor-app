'use client';

import { ReactNode } from 'react';
import { useStickyHeader } from '@/lib/hooks/useStickyHeader';
import { cn } from '@/lib/utils';

export function StickyHeaderShell({ children }: { children: ReactNode }) {
  const { sentinelRef, isSticky } = useStickyHeader();

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-slate-950 text-white',
          `
            transition-[padding,box-shadow] duration-300 ease-out
            motion-reduce:transition-none
          `,
          isSticky ? 'py-0 shadow-md' : 'py-1'
        )}
      >
        {children}
      </header>
    </>
  );
}
