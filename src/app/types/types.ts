export type record = Record<
  string,
  string | number | Record<string, string | number>
> & { id: string };
