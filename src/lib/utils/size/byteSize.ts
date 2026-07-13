export function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}
