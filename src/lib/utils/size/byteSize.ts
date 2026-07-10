export function byteSize(input: string) {
  return new TextEncoder().encode(input).length;
}
