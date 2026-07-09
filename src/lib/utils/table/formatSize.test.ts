import { formatSize } from './formatSize';

describe('formatSize', () => {
  it('should return "0 B" for 0 bytes', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('should format bytes correctly', () => {
    expect(formatSize(1)).toBe('1.0 B');
    expect(formatSize(500)).toBe('500.0 B');
    expect(formatSize(1023)).toBe('1023.0 B');
  });

  it('should format kilobytes correctly', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(1536)).toBe('1.5 KB');
    expect(formatSize(1024 * 1023)).toBe('1023.0 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    expect(formatSize(1024 * 1024 * 1023)).toBe('1023.0 MB');
  });

  it('should format gigabytes correctly', () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    expect(formatSize(1024 * 1024 * 1024 * 3.7)).toBe('3.7 GB');
  });

  it('should handle large numbers', () => {
    expect(formatSize(1024 * 1024 * 1024 * 5)).toBe('5.0 GB');
    expect(formatSize(1024 * 1024 * 1024 * 8.5)).toBe('8.5 GB');
  });
});
