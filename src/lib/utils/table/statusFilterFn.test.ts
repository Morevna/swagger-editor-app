import { Row } from '@tanstack/react-table';
import { statusFilterFn } from './statusFilterFn';

const makeRow = (status: string): Row<{ status: string }> =>
  ({
    getValue: vi.fn(() => status),
  }) as unknown as Row<{ status: string }>;

describe('statusFilterFn', () => {
  test('should return "true" for all statuses if filterValue = "allStatuses"', () => {
    const row100 = makeRow('100');
    const row200 = makeRow('200');
    const row300 = makeRow('300');
    const row400 = makeRow('400');
    const row500 = makeRow('500');

    expect(statusFilterFn(row100, 'method', 'allStatuses')).toBe(true);
    expect(statusFilterFn(row200, 'method', 'allStatuses')).toBe(true);
    expect(statusFilterFn(row300, 'method', 'allStatuses')).toBe(true);
    expect(statusFilterFn(row400, 'method', 'allStatuses')).toBe(true);
    expect(statusFilterFn(row500, 'method', 'allStatuses')).toBe(true);
  });

  test('should return "true" if the filterValue equals the cellValue status group', () => {
    const row100 = makeRow('100');
    const row200 = makeRow('200');
    const row300 = makeRow('300');
    const row400 = makeRow('400');
    const row500 = makeRow('500');

    expect(statusFilterFn(row100, 'method', '1xx')).toBe(true);
    expect(statusFilterFn(row200, 'method', '2xx')).toBe(true);
    expect(statusFilterFn(row300, 'method', '3xx')).toBe(true);
    expect(statusFilterFn(row400, 'method', '4xx')).toBe(true);
    expect(statusFilterFn(row500, 'method', '5xx')).toBe(true);
  });

  test('should return "false" if filterValue !== "cellValue"', () => {
    const row100 = makeRow('100');
    const row200 = makeRow('200');
    const row300 = makeRow('300');
    const row400 = makeRow('400');
    const row500 = makeRow('500');

    expect(statusFilterFn(row100, 'method', '2xx')).toBe(false);
    expect(statusFilterFn(row200, 'method', '1xx')).toBe(false);
    expect(statusFilterFn(row300, 'method', '1xx')).toBe(false);
    expect(statusFilterFn(row400, 'method', '1xx')).toBe(false);
    expect(statusFilterFn(row500, 'method', '1xx')).toBe(false);
  });
});
