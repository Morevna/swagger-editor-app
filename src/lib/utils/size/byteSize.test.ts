import { byteSize } from './byteSize';

describe('byteSize', () => {
  it('should return 0 for an empty string', () => {
    expect(byteSize('')).toBe(0);
  });

  it('should count ASCII characters as 1 byte each', () => {
    expect(byteSize('hello')).toBe(5);
    expect(byteSize('abc123!@#')).toBe(9);
  });

  it('must take into account special characters and line breaks', () => {
    expect(byteSize('\r\n')).toBe(2);
    expect(byteSize('\t')).toBe(1);
    expect(byteSize('a\nb')).toBe(3);
  });

  it('should read the HTTP header correctly', () => {
    const header = 'Content-Type: application/json\r\n';
    expect(byteSize(header)).toBe(32);
  });

  it('should parse the JSON body correctly', () => {
    const json = '{"name":"test","value":123}';
    expect(byteSize(json)).toBe(27);
  });
});
