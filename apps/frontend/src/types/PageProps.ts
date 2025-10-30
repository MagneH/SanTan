export interface PageProps<T> {
  data: T | undefined | null;
  encodeDataAttribute?: (fieldName: Array<string>) => string | undefined;
}
