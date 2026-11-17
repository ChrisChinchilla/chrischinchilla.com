const daysInMonth = (year, month) => {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const isValidCalendarDate = (year, month, day) =>
  year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);

/** Return a valid ISO-8601 video date, or undefined when the value is absent or invalid. */
export const normalizeVideoUploadDate = (value) => {
  if (value instanceof Date) return Number.isNaN(value.valueOf()) ? undefined : value.toISOString();
  if (typeof value !== 'string' || !value.trim()) return undefined;

  const input = value.trim();
  const dateOnly = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return isValidCalendarDate(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3])) ? input : undefined;
  }

  const dateTime = input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/);
  if (dateTime) {
    const [, year, month, day, hour, minute, second, , zone] = dateTime;
    const offset = zone === 'Z' ? undefined : zone.match(/[+-](\d{2}):(\d{2})$/);
    const validOffset = !offset || (Number(offset[1]) <= 23 && Number(offset[2]) <= 59);
    const validTime = Number(hour) <= 23 && Number(minute) <= 59 && Number(second) <= 59;
    return isValidCalendarDate(Number(year), Number(month), Number(day)) && validTime && validOffset
      ? input
      : undefined;
  }

  // Podcast RSS dates may use RFC 2822, which can still be normalized without changing their source.
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return undefined;
  const parsed = new Date(input);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
};

/** Build a VideoObject only when its required upload date can be validated. */
export const createVideoObjectSchema = (data, pageUrl) => {
  const uploadDate = normalizeVideoUploadDate(data.uploadDate);
  if (!uploadDate) return undefined;

  const chapters = Array.isArray(data.chapters) ? data.chapters : [];
  return {
    '@type': 'VideoObject',
    name: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate,
    duration: data.duration,
    inLanguage: data.transcript || data.inLanguage ? 'en' : undefined,
    embedUrl: data.videoId ? `https://www.youtube.com/embed/${data.videoId}` : undefined,
    contentUrl: data.videoId ? `https://www.youtube.com/watch?v=${data.videoId}` : undefined,
    url: data.canonical || pageUrl,
    transcript: data.transcript,
    hasPart: chapters.length
      ? chapters.map((chapter) => ({
          '@type': 'Clip',
          name: chapter.label,
          startOffset: chapter.start,
          endOffset: chapter.end,
          url: `https://www.youtube.com/watch?v=${data.videoId}&t=${chapter.start}s`,
        }))
      : undefined,
  };
};
