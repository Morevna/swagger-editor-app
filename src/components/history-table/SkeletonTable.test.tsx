import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonTable } from './SkeletonTable';
import { SKELETON_SIDEBAR_ROWS, SKELETON_COLUMNS, SKELETON_ROWS } from '@/constants/tableSizes';

describe('SkeletonTable', () => {
  it('should render skeleton table', () => {
    render(<SkeletonTable />);
    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument();
  });

  it('should render correct number of sidebar rows', () => {
    render(<SkeletonTable />);
    const sidebarRows = screen.getAllByTestId('skeleton-sidebar-row');
    expect(sidebarRows).toHaveLength(SKELETON_SIDEBAR_ROWS);
  });

  it('should render correct number of table header columns', () => {
    render(<SkeletonTable />);
    const headerCells = screen.getAllByTestId('skeleton-table-header-cell');
    expect(headerCells).toHaveLength(SKELETON_COLUMNS);
  });

  it('should render correct number of table rows', () => {
    render(<SkeletonTable />);
    const rows = screen.getAllByTestId('skeleton-table-row');
    expect(rows).toHaveLength(SKELETON_ROWS);
  });

  it('should render correct number of cells per row', () => {
    render(<SkeletonTable />);
    const cells = screen.getAllByTestId('skeleton-table-cell');
    expect(cells).toHaveLength(SKELETON_ROWS * SKELETON_COLUMNS);
  });

  it('should render all skeleton elements', () => {
    render(<SkeletonTable />);

    const sidebarRows = screen.getAllByTestId('skeleton-sidebar-row');
    const headerCells = screen.getAllByTestId('skeleton-table-header-cell');
    const tableCells = screen.getAllByTestId('skeleton-table-cell');

    expect(sidebarRows).toHaveLength(SKELETON_SIDEBAR_ROWS);
    expect(headerCells).toHaveLength(SKELETON_COLUMNS);
    expect(tableCells).toHaveLength(SKELETON_ROWS * SKELETON_COLUMNS);
  });
});
