import { formatDateTime } from './formatDateTime';

const testDate = '2026-07-06T12:00:00.000Z';

describe('formatDateTime', () => {
  it('should format date correctly for EN locale', () => {
    const result = formatDateTime(testDate, 'en');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AM|PM]/);
  });

  it('should format date correctly for RU locale', () => {
    const result = formatDateTime(testDate, 'ru');
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}/);
  });

  it('should display day as 2 digits', () => {
    const result = formatDateTime(testDate, 'en');
    const resultRu = formatDateTime(testDate, 'ru');
    expect(result).toContain('06');
    expect(resultRu).toContain('06');
  });

  it('should display month as 2 digits', () => {
    const result = formatDateTime(testDate, 'en');
    const resultRu = formatDateTime(testDate, 'ru');
    expect(result).toContain('07');
    expect(resultRu).toContain('07');
  });

  it('should display year as 4 digits', () => {
    const result = formatDateTime(testDate, 'en');
    const resultRu = formatDateTime(testDate, 'ru');
    expect(result).toContain('2026');
    expect(resultRu).toContain('2026');
  });
});
