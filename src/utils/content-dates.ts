/** Normalize content dates to UTC calendar days across public outputs. */
export const toIsoDate = (value: unknown): string | undefined => {
  if (!(value instanceof Date) && typeof value !== 'string') return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
};

export interface ContentDates {
  publishDate?: unknown;
  publish_date?: unknown;
  release_date?: unknown;
  date?: unknown;
  modifiedDate?: unknown;
}

export const getContentDates = (data: ContentDates = {}) => {
  const publishedDate = toIsoDate(data.publishDate ?? data.publish_date ?? data.release_date ?? data.date);
  const candidate = toIsoDate(data.modifiedDate);
  const modifiedDate = candidate && (!publishedDate || candidate > publishedDate) ? candidate : undefined;
  return { publishedDate, modifiedDate };
};
