import { Row } from '@tanstack/react-table';
import { methodsFilterFn } from './methodsFilterFn';

const makeRow = (method: string): Row<{ method: string }> =>
  ({
    getValue: vi.fn(() => method),
  }) as unknown as Row<{ method: string }>;

describe('methodsFilterFn', () => {
  test('should return "true" for all methods if filterValue = "allMethods"', () => {
    const rowGET = makeRow('GET');
    const rowPOST = makeRow('POST');
    const rowPUT = makeRow('PUT');
    const rowDELETE = makeRow('DELETE');
    const rowPATCH = makeRow('PATCH');
    const rowHEAD = makeRow('HEAD');
    const rowOPTIONS = makeRow('OPTIONS');

    expect(methodsFilterFn(rowGET, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowPOST, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowPUT, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowDELETE, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowPATCH, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowHEAD, 'method', 'allMethods')).toBe(true);
    expect(methodsFilterFn(rowOPTIONS, 'method', 'allMethods')).toBe(true);
  });

  test('should return "true" if filterValue === "cellValue"', () => {
    const rowGET = makeRow('GET');
    const rowPOST = makeRow('POST');
    const rowPUT = makeRow('PUT');
    const rowDELETE = makeRow('DELETE');
    const rowPATCH = makeRow('PATCH');
    const rowHEAD = makeRow('HEAD');
    const rowOPTIONS = makeRow('OPTIONS');

    expect(methodsFilterFn(rowGET, 'method', 'GET')).toBe(true);
    expect(methodsFilterFn(rowPOST, 'method', 'POST')).toBe(true);
    expect(methodsFilterFn(rowPUT, 'method', 'PUT')).toBe(true);
    expect(methodsFilterFn(rowDELETE, 'method', 'DELETE')).toBe(true);
    expect(methodsFilterFn(rowPATCH, 'method', 'PATCH')).toBe(true);
    expect(methodsFilterFn(rowHEAD, 'method', 'HEAD')).toBe(true);
    expect(methodsFilterFn(rowOPTIONS, 'method', 'OPTIONS')).toBe(true);
  });

  test('should return "false" if filterValue !== "cellValue"', () => {
    const rowGET = makeRow('GET');
    const rowPOST = makeRow('POST');
    const rowPUT = makeRow('PUT');
    const rowDELETE = makeRow('DELETE');
    const rowPATCH = makeRow('PATCH');
    const rowHEAD = makeRow('HEAD');
    const rowOPTIONS = makeRow('OPTIONS');

    expect(methodsFilterFn(rowGET, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowPOST, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowPUT, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowDELETE, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowPATCH, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowHEAD, 'method', 'OPTIONS')).toBe(false);
    expect(methodsFilterFn(rowOPTIONS, 'method', 'GET')).toBe(false);
  });
});
