import { fireEvent, render, screen } from '@testing-library/react';
import { HistoryTable } from './HistoryTable';
import { MOCK_LOGS } from '@/lib/mocks/logs';

const TEST_DATE = '2026-07-06T12:00:00.000Z';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('@/lib/actions/auth', () => ({
  signInAction: vi.fn(),
}));

describe('HistoryTable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(TEST_DATE));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

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

    expect(screen.getByText('PATCH')).toBeInTheDocument();
    expect(screen.getByText('https://petstore3.swagger.io/api/v3/pet/1')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/37/)).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row')).toHaveLength(MOCK_LOGS.length);
  });

  describe('DropdownMenu Columns Visibility', () => {
    it('should display visibility toggle options for all table columns when the columns button is clicked', () => {
      render(<HistoryTable data={MOCK_LOGS} />);

      const triggerButton = screen.getByRole('button', { name: /columns/i });
      fireEvent.click(triggerButton);

      expect(screen.getByText('method')).toBeInTheDocument();
      expect(screen.getByText('endpoint')).toBeInTheDocument();
      expect(screen.getByText('status')).toBeInTheDocument();
      expect(screen.getByText('duration')).toBeInTheDocument();
      expect(screen.getByText('requestSize')).toBeInTheDocument();
      expect(screen.getByText('responseSize')).toBeInTheDocument();
      expect(screen.getByText('errorDetails')).toBeInTheDocument();
      expect(screen.getByText('time')).toBeInTheDocument();
    });
  });
});
