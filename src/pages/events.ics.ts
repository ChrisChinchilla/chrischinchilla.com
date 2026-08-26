import ical from 'ical-generator';
import { getCollection } from 'astro:content';

import { SITE, EVENT } from '~/config.mjs';

export const GET = async () => {
  if (EVENT.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const now = new Date();
  const events = (await getCollection('events')).filter((event) => new Date(event.data.start_date) >= now);

  const calendar = ical({ name: `${SITE.name} — Events`, url: `${SITE.origin}/events.ics` });

  for (const event of events) {
    const start = new Date(event.data.start_date);
    const end = event.data.end_date ? new Date(event.data.end_date) : new Date(start.getTime() + 60 * 60 * 1000);
    const label = event.data.type === 'speaking' ? ` (speaking)` : '';

    calendar.createEvent({
      start,
      end,
      summary: `${event.data.title ?? event.data.event}${label}`,
      description: event.data.summary,
      location: event.data.venue,
      url: event.data.pres_url,
    });
  }

  return new Response(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  });
};
