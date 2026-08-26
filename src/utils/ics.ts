// Shared iCalendar (RFC 5545) helpers for the events feed and per-event
// "Add to calendar" links. Kept dependency-free since a single VEVENT is a
// handful of lines - ical-generator (used by events.ics.ts) is overkill for
// building one inline data: URI per card.

export interface IcsEventInput {
  title: string;
  event: string;
  summary?: string;
  venue?: string;
  url?: string;
  start_date: Date;
  end_date?: Date;
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildEventVevent(input: IcsEventInput): string {
  const start = new Date(input.start_date);
  const end = input.end_date ? new Date(input.end_date) : new Date(start.getTime() + 60 * 60 * 1000);
  const uid = `${toIcsDate(start)}-${input.event.replace(/[^a-z0-9]+/gi, '-')}@chrischinchilla.com`;

  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
  ];

  if (input.summary) lines.push(`DESCRIPTION:${escapeIcsText(input.summary)}`);
  if (input.venue) lines.push(`LOCATION:${escapeIcsText(input.venue)}`);
  if (input.url) lines.push(`URL:${input.url}`);

  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

export function buildEventIcs(input: IcsEventInput): string {
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//chrischinchilla.com//Events//EN', buildEventVevent(input), 'END:VCALENDAR'].join(
    '\r\n'
  );
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
