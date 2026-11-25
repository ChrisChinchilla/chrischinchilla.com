import { getCollection } from 'astro:content';

import { SITE, EVENT } from '~/config.mjs';
import { buildCalendar } from '~/utils/ics';

export const GET = async () => {
  if (EVENT.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const now = new Date();
  const events = (await getCollection('events')).filter((event) => new Date(event.data.start_date) >= now);

  const calendar = buildCalendar(
    `${SITE.name} — Events`,
    events.map(({ data }) => ({
      title: `${data.title ?? data.event}${data.type === 'speaking' ? ' (speaking)' : ''}`,
      event: data.event,
      summary: data.summary,
      venue: data.venue,
      url: data.pres_url,
      start_date: data.start_date,
      end_date: data.end_date,
    })),
  );

  return new Response(calendar, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  });
};
