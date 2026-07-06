import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryTable } from './HistoryTable';
import { PAGE_SIZE } from '@/constants/historyTable';
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

  it('renders texts and buttons', () => {
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

  it('renders Empty history message if []', () => {
    render(<HistoryTable data={[]} />);

    expect(screen.getByText('empty')).toBeInTheDocument();
    expect(screen.getByText('emptyMessage')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'emptyButton' })).toBeInTheDocument();
  });

  it('correctly renders data', () => {
    render(<HistoryTable data={MOCK_LOGS} />);

    expect(screen.getByText('PATCH')).toBeInTheDocument();
    expect(screen.getByText('https://petstore3.swagger.io/api/v3/pet/1')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/37/)).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row')).toHaveLength(MOCK_LOGS.length);
  });

  describe('DropdownMenu Columns Visibility', () => {
    it('should open the menu and show columns', () => {
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
