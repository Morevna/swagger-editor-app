import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Row } from '@tanstack/react-table';
import { dateFilterFn } from './dateFilterFn';

const TEST_TODAY_DATE = '2026-07-06T12:00:00.000Z';
const TEST_YESTERDAY_DATE = '2026-07-05T12:00:00.000Z';
const TEST_LAST_YEAR_DATE = '2025-07-06T12:00:00.000Z';

const makeRow = (date: string): Row<{ date: string }> =>
  ({
    getValue: vi.fn(() => date),
  }) as unknown as Row<{ date: string }>;

describe('dateFilterFn', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(TEST_TODAY_DATE));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns true for all', () => {
    const row = makeRow(TEST_TODAY_DATE);
    expect(dateFilterFn(row, 'date', 'all')).toBe(true);
  });

  it('returns true for today date', () => {
    const row = makeRow(TEST_TODAY_DATE);
    expect(dateFilterFn(row, 'date', 'today')).toBe(true);
  });

  it('returns false for yesterday date in today filter', () => {
    const row = makeRow(TEST_YESTERDAY_DATE);
    expect(dateFilterFn(row, 'date', 'today')).toBe(false);
  });

  it('returns true for yesterday filter inside yesterday range', () => {
    const row = makeRow(TEST_YESTERDAY_DATE);
    expect(dateFilterFn(row, 'date', 'yesterday')).toBe(true);
  });

  it('returns false for today in yesterday filter', () => {
    const row = makeRow(TEST_TODAY_DATE);
    expect(dateFilterFn(row, 'date', 'yesterday')).toBe(false);
  });

  it('returns false for too old date in lastWeek', () => {
    const row = makeRow(TEST_LAST_YEAR_DATE);
    expect(dateFilterFn(row, 'date', 'lastWeek')).toBe(false);
  });

  it('returns true for recent date in lastWeek', () => {
    const row = makeRow(TEST_TODAY_DATE);
    expect(dateFilterFn(row, 'date', 'lastWeek')).toBe(true);
  });

  it('returns false for too old date in lastMonth', () => {
    const row = makeRow(TEST_LAST_YEAR_DATE);
    expect(dateFilterFn(row, 'date', 'lastMonth')).toBe(false);
  });

  it('returns true for recent date in lastMonth', () => {
    const row = makeRow(TEST_TODAY_DATE);
    expect(dateFilterFn(row, 'date', 'lastMonth')).toBe(true);
  });
});
