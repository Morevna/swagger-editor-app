import { getStatusGroup } from './getStatusGroup';

describe('getStatusGroup', () => {
  test('should return "2xx" for 2xx status codes', () => {
    expect(getStatusGroup(200)).toBe('2xx');
    expect(getStatusGroup(201)).toBe('2xx');
    expect(getStatusGroup(299)).toBe('2xx');
  });

  test('should return "3xx" for 3xx status codes', () => {
    expect(getStatusGroup(300)).toBe('3xx');
    expect(getStatusGroup(301)).toBe('3xx');
    expect(getStatusGroup(399)).toBe('3xx');
  });

  test('should return "4xx" for 4xx status codes', () => {
    expect(getStatusGroup(400)).toBe('4xx');
    expect(getStatusGroup(401)).toBe('4xx');
    expect(getStatusGroup(499)).toBe('4xx');
  });

  test('should return "5xx" for 5xx status codes', () => {
    expect(getStatusGroup(500)).toBe('5xx');
    expect(getStatusGroup(502)).toBe('5xx');
    expect(getStatusGroup(599)).toBe('5xx');
  });

  test('should return "2xx" for status codes below 200', () => {
    expect(getStatusGroup(100)).toBe('2xx');
    expect(getStatusGroup(199)).toBe('2xx');
  });
});
