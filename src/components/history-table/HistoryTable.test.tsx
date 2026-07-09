import { render, screen } from '@testing-library/react';
import { MOCK_LOGS } from '@/lib/mocks/logs';
import HistoryTable from './HistoryTable';
import userEvent from '@testing-library/user-event';
import { PAGE_SIZE } from '@/constants/tableSizes';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

describe('HistoryTable', () => {
  it('should render title, column headers, and buttons on mount', () => {
    render(<HistoryTable data={MOCK_LOGS} />);

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'endpoint' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'duration' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'requestSize' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'responseSize' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'errorDetails' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'time' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'columns' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'next' })).toBeInTheDocument();
  });

  it('should display empty state message and a call-to-action link when no logs are provided', () => {
    render(<HistoryTable data={[]} />);

    expect(screen.getByText('empty')).toBeInTheDocument();
    expect(screen.getByText('emptyMessage')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'emptyButton' })).toBeInTheDocument();
  });

  it('should correctly populate table rows and cell values with the provided mock logs data', () => {
    render(<HistoryTable data={MOCK_LOGS} />);

    const elements = screen.getAllByText('PATCH');
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getByText('https://petstore3.swagger.io/api/v3/pet/1')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/37/)).toBeInTheDocument();
  });

  it('should display correct number of rows', () => {
    render(<HistoryTable data={MOCK_LOGS} />);
    expect(screen.getAllByTestId('table-row')).toHaveLength(MOCK_LOGS.length);
  });

  it('should switch pages correctly ', async () => {
    const user = userEvent.setup();
    const longMockDatq = [...MOCK_LOGS, ...MOCK_LOGS];
    render(<HistoryTable data={longMockDatq} />);

    expect(screen.getAllByTestId('table-row')).toHaveLength(PAGE_SIZE);

    const nextButton = screen.getByRole('button', { name: 'next' });

    await user.click(nextButton);

    expect(screen.getAllByTestId('table-row')).toHaveLength(longMockDatq.length - PAGE_SIZE);

    const previousButton = screen.getByRole('button', { name: 'previous' });

    await user.click(previousButton);

    expect(screen.getAllByTestId('table-row')).toHaveLength(PAGE_SIZE);
  });

  describe('FilterSidebar', () => {
    it('should filter table rows by method', async () => {
      const user = userEvent.setup();
      render(<HistoryTable data={MOCK_LOGS} />);

      const patchCellArray = screen.getAllByRole('cell', { name: /PATCH/i });

      expect(patchCellArray.length).toBeGreaterThan(0);

      await user.click(screen.getByRole('radio', { name: /PUT/i }));

      expect(screen.queryByRole('cell', { name: /PATCH/i })).not.toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: /allMethods/i }));

      expect(patchCellArray.length).toBeGreaterThan(0);
    });

    it('should filter table rows by time', async () => {
      const user = userEvent.setup();
      render(<HistoryTable data={MOCK_LOGS} />);

      expect(screen.getAllByTestId('table-row')).toHaveLength(MOCK_LOGS.length);

      await user.click(screen.getByRole('radio', { name: /today/i }));

      expect(screen.queryByTestId('table-row')).not.toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: /allTime/i }));

      expect(screen.getAllByTestId('table-row')).toHaveLength(MOCK_LOGS.length);
    });

    it('should filter table rows by status', async () => {
      const user = userEvent.setup();
      render(
        <HistoryTable
          data={[
            {
              method: 'PATCH',
              endpoint: 'https://petstore3.swagger.io/api/v3/pet/1',
              status: 404,
              duration: 37,
              requestSize: 1629,
              responseSize: 285,
              errorDetails: null,
              time: '2026-07-06T12:00:00.000Z',
            },
          ]}
        />
      );

      expect(screen.getByRole('cell', { name: /404/i })).toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: /1xx/i }));

      expect(screen.queryByRole('cell', { name: /404/i })).not.toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: /allStatuses/i }));

      expect(screen.getByRole('cell', { name: /404/i })).toBeInTheDocument();
    });
  });

  describe('DropdownMenu Columns Visibility', () => {
    it('should display visibility toggle options for all table columns when the columns button is clicked', async () => {
      const user = userEvent.setup();
      render(<HistoryTable data={MOCK_LOGS} />);

      await user.click(screen.getByRole('button', { name: /columns/i }));

      const itemMethod = screen.getByRole('menuitemcheckbox', { name: /method/i });
      const itemEndpoint = screen.getByRole('menuitemcheckbox', { name: /endpoint/i });
      const itemStatus = screen.getByRole('menuitemcheckbox', { name: /status/i });
      const itemDuration = screen.getByRole('menuitemcheckbox', { name: /duration/i });
      const itemRequestSize = screen.getByRole('menuitemcheckbox', { name: /requestSize/i });
      const itemResponseSize = screen.getByRole('menuitemcheckbox', { name: /responseSize/i });
      const itemErrorDetails = screen.getByRole('menuitemcheckbox', { name: /errorDetails/i });
      const itemTime = screen.getByRole('menuitemcheckbox', { name: /time/i });

      expect(itemMethod).toBeInTheDocument();
      expect(itemEndpoint).toBeInTheDocument();
      expect(itemStatus).toBeInTheDocument();
      expect(itemDuration).toBeInTheDocument();
      expect(itemRequestSize).toBeInTheDocument();
      expect(itemResponseSize).toBeInTheDocument();
      expect(itemErrorDetails).toBeInTheDocument();
      expect(itemTime).toBeInTheDocument();

      await user.click(itemMethod);

      expect(itemMethod).not.toBeChecked();
    });

    it('should display visibility toggle options for all table columns when the columns button is clicked', async () => {
      render(
        <HistoryTable
          data={[
            {
              method: 'PATCH',
              endpoint: 'https://petstore3.swagger.io/api/v3/pet/1',
              status: 404,
              duration: 37,
              requestSize: 1629,
              responseSize: 285,
              errorDetails: null,
              time: '2026-07-06T12:00:00.000Z',
            },
          ]}
        />
      );
      const user = userEvent.setup();
      const cell = screen.getByRole('cell', { name: /PATCH/i });

      expect(cell).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /columns/i }));

      const itemMethod = screen.getByRole('menuitemcheckbox', { name: /method/i });

      await user.click(itemMethod);

      expect(cell).not.toBeInTheDocument();
    });
  });
});
