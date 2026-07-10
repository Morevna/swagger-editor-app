import { render, screen } from '@testing-library/react';
import { SkeletonTable } from './SkeletonTable';

describe('SkeletonTable', () => {
  it('should render (smoke test)', () => {
    render(<SkeletonTable />);

    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument();
  });
});
