import { getCollection } from 'astro:content';
import { SITE } from '~/config.mjs';

const origin = SITE.origin;

// Static, non-collection pages (no shared frontmatter schema), listed by hand.
const staticPages = [
  { title: 'CV and resume', path: '/cv', summary: 'Work history, publications, talks, and community involvement.' },
  { title: 'Community and volunteering', path: '/community', summary: 'Communities and volunteering efforts Chris organises or contributes to.' },
  { title: 'Work with me', path: '/contact', summary: 'Services offered (writing, editing, video/audio production, workshops) and how to get in touch.' },
  { title: 'Courses', path: '/courses', summary: 'Video courses Chris has produced or contributed to.' },
];

function entryUrl(localPath: string, publicationUrl?: string): string {
  return publicationUrl ?? `${origin}${localPath}`;
}

function formatLink(title: string, url: string, summary?: string): string {
  const desc = summary ? ` — ${summary.replace(/\n/g, ' ').trim()}` : '';
  return `- [${title}](${url})${desc}`;
}

export const GET = async () => {
  const [posts, stories, newsletters, books, music, av, gear, podcasts, games, events, clients] = await Promise.all([
    getCollection('posts'),
    getCollection('stories'),
    getCollection('newsletters'),
    getCollection('books'),
    getCollection('music'),
    getCollection('av'),
    getCollection('gear'),
    getCollection('podcasts'),
    getCollection('games'),
    getCollection('events'),
    getCollection('clients'),
  ]);

  const sortedPosts = posts
    .filter((p) => p.data.publishDate)
    .sort((a, b) => new Date(b.data.publishDate!).valueOf() - new Date(a.data.publishDate!).valueOf());

  const sortedStories = stories
    .filter((s) => s.data.date)
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  const sortedNewsletters = newsletters
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  const sortedBooks = books
    .sort((a, b) => new Date(b.data.publish_date).valueOf() - new Date(a.data.publish_date).valueOf());

  const sortedMusic = music
    .sort((a, b) => new Date(b.data.release_date).valueOf() - new Date(a.data.release_date).valueOf());

  const sortedAv = av
    .sort((a, b) => new Date(b.data.publish_date).valueOf() - new Date(a.data.publish_date).valueOf());

  const sortedGear = gear
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  const sortedPodcasts = podcasts
    .sort((a, b) => (a.data.title ?? '').localeCompare(b.data.title ?? ''));

  const sortedGames = games
    .sort((a, b) => new Date(b.data.publish_date ?? 0).valueOf() - new Date(a.data.publish_date ?? 0).valueOf());

  const sortedEvents = events
    .sort((a, b) => new Date(b.data.start_date).valueOf() - new Date(a.data.start_date).valueOf());

  const sortedClients = clients
    .sort((a, b) => (b.data.end_date ?? 0) - (a.data.end_date ?? 0));

  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `> Full content available at [${origin}/llms-full.txt](${origin}/llms-full.txt)`,
    '',
  ];

  // About — static pages with no shared content collection schema
  lines.push('## About', '');
  for (const page of staticPages) {
    lines.push(formatLink(page.title, `${origin}${page.path}`, page.summary));
  }
  lines.push('');

  // Blog Posts
  lines.push('## Blog Posts', '');
  for (const post of sortedPosts) {
    const url = entryUrl(`/blog/${post.id}`, post.data.publication_url);
    lines.push(formatLink(post.data.title, url, post.data.summary));
  }
  lines.push('');

  // Stories
  lines.push('## Fiction & Stories', '');
  for (const story of sortedStories) {
    const url = entryUrl(`/stories/${story.id}`, story.data.publication_url);
    lines.push(formatLink(story.data.title, url, story.data.summary));
  }
  lines.push('');

  // Newsletters
  lines.push('## Newsletters', '');
  for (const newsletter of sortedNewsletters) {
    const url = entryUrl(`/newsletter/${newsletter.id}`, newsletter.data.publication_url);
    lines.push(formatLink(newsletter.data.title, url, newsletter.data.summary));
  }
  lines.push('');

  // Podcasts
  lines.push('## Podcasts', '');
  for (const podcast of sortedPodcasts) {
    const url = entryUrl(`/podcast/${podcast.id}`, podcast.data.publication_url);
    lines.push(formatLink(podcast.data.title ?? podcast.id, url, podcast.data.description));
  }
  lines.push('');

  // Books
  lines.push('## Books', '');
  for (const book of sortedBooks) {
    const externalUrl = book.data.publication_url ?? book.data.store_urls?.[0]?.url;
    const url = entryUrl(`/books/${book.id}`, externalUrl);
    lines.push(formatLink(book.data.title, url, book.data.summary));
  }
  lines.push('');

  // Music
  lines.push('## Music', '');
  for (const release of sortedMusic) {
    const externalUrl = release.data.store_urls?.[0]?.url ?? release.data.stream_urls?.[0]?.url;
    const url = entryUrl(`/music/${release.id}`, externalUrl);
    lines.push(formatLink(release.data.title, url, release.data.summary));
  }
  lines.push('');

  // AV / Courses
  lines.push('## Video Courses & Audio/Visual', '');
  for (const item of sortedAv) {
    const url = item.data.store_urls?.[0]?.url ?? `${origin}/videos/${item.id}`;
    lines.push(formatLink(item.data.title, url));
  }
  lines.push('');

  // Games — no individual detail pages exist yet, so entries link to the list page
  lines.push('## Games', '');
  for (const game of sortedGames) {
    const url = game.data.store_urls?.[0]?.url ?? `${origin}/games`;
    lines.push(formatLink(game.data.title, url));
  }
  lines.push('');

  // Events — no individual detail pages exist yet, link to the talk/press source when available
  lines.push('## Events & Talks', '');
  for (const event of sortedEvents) {
    const url = event.data.pres_url ?? `${origin}/events`;
    lines.push(formatLink(event.data.title ?? event.data.event, url));
  }
  lines.push('');

  // Clients — no individual detail pages exist yet, link to the client's site when available
  lines.push('## Clients', '');
  for (const client of sortedClients) {
    const url = client.data.company_url ?? `${origin}/clients`;
    lines.push(formatLink(client.data.title, url, client.data.summary || client.data.description));
  }
  lines.push('');

  // Gear
  lines.push('## Gear', '');
  for (const item of sortedGear) {
    const url = `${origin}/gear/${item.id}`;
    lines.push(formatLink(item.data.title, url, item.data.summary));
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
