import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { SITE } from '~/config.mjs';

const origin = SITE.origin;

// Static, non-collection pages (no shared frontmatter schema): read their real body
// content directly from src/pages/ rather than hand-duplicating it here.
function readStaticPage(filename: string): { title: string; body: string } {
  const filePath = path.resolve(process.cwd(), 'src/pages', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const body = content
    .split('\n')
    .filter((line) => !/^import .+ from ['"].+['"];?$/.test(line.trim()) && !/^<[A-Za-z][^>]*\/>$/.test(line.trim()))
    .join('\n')
    .trim();
  return { title: data.title ?? filename, body };
}

const staticPages = [
  { ...readStaticPage('cv.md'), path: '/cv' },
  { ...readStaticPage('community.md'), path: '/community' },
  { ...readStaticPage('contact.mdx'), path: '/contact' },
  { title: 'Courses', path: '/courses', body: 'Video courses Chris has produced or contributed to.' },
];

function entryUrl(localPath: string, publicationUrl?: string): string {
  return publicationUrl ?? `${origin}${localPath}`;
}

function sectionSeparator(title: string, url: string, date: string, summary?: string): string {
  const lines = [`## [${title}](${url})`, ``, `Date: ${date}`];
  if (summary) lines.push(``, summary);
  lines.push('', '---', '');
  return lines.join('\n');
}

export const GET = async () => {
  const [posts, stories, newsletters, books, music, av, gear, software, podcasts, games, events, clients] = await Promise.all([
    getCollection('posts'),
    getCollection('stories'),
    getCollection('newsletters'),
    getCollection('books'),
    getCollection('music'),
    getCollection('av'),
    getCollection('gear'),
    getCollection('software'),
    getCollection('podcasts'),
    getCollection('games'),
    getCollection('events'),
    getCollection('clients'),
  ]);

  const sortedPosts = posts
    .sort((a, b) => new Date(b.data.publishDate).valueOf() - new Date(a.data.publishDate).valueOf());

  const sortedStories = stories
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

  const sortedSoftware = software
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
    `# ${SITE.name} — Full Content`,
    '',
    `> ${SITE.description}`,
    '',
    `> Index at [${origin}/llms.txt](${origin}/llms.txt)`,
    '',
  ];

  // About — static pages with no shared content collection schema
  lines.push('# About', '', '---', '');
  for (const page of staticPages) {
    lines.push(`## [${page.title}](${origin}${page.path})`, '');
    if (page.body) lines.push(page.body, '');
    lines.push('---', '');
  }

  // Blog Posts
  lines.push('# Blog Posts', '', '---', '');
  for (const post of sortedPosts) {
    const url = entryUrl(`/blog/${post.id}`, post.data.publication_url);
    const date = new Date(post.data.publishDate).toISOString().split('T')[0];

    if (post.data.publication_url) {
      // Externally published — link only, no body
      lines.push(`## [${post.data.title}](${url})`, '', `Date: ${date}`, '', `Originally published at: ${url}`, '');
      if (post.data.summary) lines.push(post.data.summary, '');
      lines.push('---', '');
    } else {
      lines.push(sectionSeparator(post.data.title, url, date, post.data.summary));
      const body = post.body ?? '';
      if (body) lines.push(body, '', '---', '');
    }
  }

  // Stories
  lines.push('# Fiction & Stories', '', '---', '');
  for (const story of sortedStories) {
    const url = entryUrl(`/stories/${story.id}`, story.data.publication_url);
    const date = new Date(story.data.date).toISOString().split('T')[0];

    if (story.data.publication_url) {
      lines.push(`## [${story.data.title}](${url})`, '', `Date: ${date}`, '', `Originally published at: ${url}`, '');
      if (story.data.summary) lines.push(story.data.summary, '');
      lines.push('---', '');
    } else {
      lines.push(sectionSeparator(story.data.title, url, date, story.data.summary));
      const body = story.body ?? '';
      if (body) lines.push(body, '', '---', '');
    }
  }

  // Newsletters
  lines.push('# Newsletters', '', '---', '');
  for (const newsletter of sortedNewsletters) {
    const url = entryUrl(`/newsletter/${newsletter.id}`, newsletter.data.publication_url);
    const date = new Date(newsletter.data.date).toISOString().split('T')[0];

    if (newsletter.data.publication_url) {
      lines.push(`## [${newsletter.data.title}](${url})`, '', `Date: ${date}`, '', `Originally published at: ${url}`, '');
      if (newsletter.data.summary) lines.push(newsletter.data.summary, '');
      lines.push('---', '');
    } else {
      lines.push(sectionSeparator(newsletter.data.title, url, date, newsletter.data.summary));
      const body = newsletter.body ?? '';
      if (body) lines.push(body, '', '---', '');
    }
  }

  // Podcasts — metadata + body/transcript
  lines.push('# Podcasts', '', '---', '');
  for (const podcast of sortedPodcasts) {
    const url = entryUrl(`/podcast/${podcast.id}`, podcast.data.publication_url);
    const title = podcast.data.title ?? podcast.id;

    lines.push(`## [${title}](${url})`, '');
    if (podcast.data.category) lines.push(`Category: ${podcast.data.category}`, '');
    if (podcast.data.description) lines.push(podcast.data.description, '');
    const body = podcast.data.transcript || podcast.body || '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Books — metadata + body
  lines.push('# Books', '', '---', '');
  for (const book of sortedBooks) {
    const externalUrl = book.data.publication_url ?? book.data.store_urls?.[0]?.url;
    const url = entryUrl(`/books/${book.id}`, externalUrl);
    const date = new Date(book.data.publish_date).toISOString().split('T')[0];

    lines.push(
      `## [${book.data.title}](${url})`,
      '',
      `Date: ${date}`,
      `Publisher: ${book.data.publisher}`,
      `Role: ${book.data.role}`,
      ''
    );
    if (book.data.summary) lines.push(book.data.summary, '');
    const body = book.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Music — metadata + body
  lines.push('# Music', '', '---', '');
  for (const release of sortedMusic) {
    const externalUrl = release.data.store_urls?.[0]?.url ?? release.data.stream_urls?.[0]?.url;
    const url = entryUrl(`/music/${release.id}`, externalUrl);
    const date = new Date(release.data.release_date).toISOString().split('T')[0];

    lines.push(`## [${release.data.title}](${url})`, '', `Date: ${date}`, `Band: ${release.data.band}`);
    if (release.data.record_label) lines.push(`Label: ${release.data.record_label}`);
    if (release.data.role) lines.push(`Role: ${release.data.role}`);
    lines.push('');
    if (release.data.summary) lines.push(release.data.summary, '');
    const body = release.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // AV / Courses — metadata + body
  lines.push('# Video Courses & Audio/Visual', '', '---', '');
  for (const item of sortedAv) {
    const url = item.data.store_urls?.[0]?.url ?? `${origin}/videos/${item.id}`;
    const date = new Date(item.data.publish_date).toISOString().split('T')[0];

    lines.push(
      `## [${item.data.title}](${url})`,
      '',
      `Date: ${date}`,
      `Client: ${item.data.client}`,
      `Type: ${item.data.video_type}`,
      ''
    );
    if (item.data.summary) lines.push(item.data.summary, '');
    const body = item.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Games — no individual detail pages exist yet, so entries link to the list page
  lines.push('# Games', '', '---', '');
  for (const game of sortedGames) {
    const url = game.data.store_urls?.[0]?.url ?? `${origin}/games`;
    const date = game.data.publish_date ? new Date(game.data.publish_date).toISOString().split('T')[0] : 'unknown';

    lines.push(`## [${game.data.title}](${url})`, '', `Date: ${date}`);
    if (game.data.publisher) lines.push(`Publisher: ${game.data.publisher}`);
    lines.push(`Role: ${game.data.role}`, '');
    if (game.data.summary) lines.push(game.data.summary, '');
    const body = game.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Events — no individual detail pages exist yet, link to the talk/press source when available
  lines.push('# Events & Talks', '', '---', '');
  for (const event of sortedEvents) {
    const url = event.data.pres_url ?? `${origin}/events`;
    const date = new Date(event.data.start_date).toISOString().split('T')[0];
    const title = event.data.title ?? event.data.event;

    lines.push(`## [${title}](${url})`, '', `Date: ${date}`, `Event: ${event.data.event}`);
    if (event.data.venue) lines.push(`Venue: ${event.data.venue}`);
    if (event.data.pres_source) lines.push(`Source: ${event.data.pres_source}`);
    lines.push('');
    if (event.data.summary) lines.push(event.data.summary, '');
    const body = event.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Clients — no individual detail pages exist yet, link to the client's site when available
  lines.push('# Clients', '', '---', '');
  for (const client of sortedClients) {
    const url = client.data.company_url ?? `${origin}/clients`;

    lines.push(`## [${client.data.title}](${url})`, '', `Type: ${client.data.type}`);
    if (client.data.start_date) {
      const range = client.data.current ? `${client.data.start_date} — present` : `${client.data.start_date}${client.data.end_date ? ` — ${client.data.end_date}` : ''}`;
      lines.push(`Engagement: ${range}`);
    }
    lines.push('');
    if (client.data.summary) lines.push(client.data.summary, '');
    if (client.data.description) lines.push(client.data.description, '');
    const body = client.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Gear — metadata + body
  lines.push('# Gear', '', '---', '');
  for (const item of sortedGear) {
    const url = `${origin}/gear/${item.id}`;
    lines.push(`## [${item.data.title}](${url})`, '');
    if (item.data.tags?.length) lines.push(`Tags: ${item.data.tags.join(', ')}`, '');
    if (item.data.affiliate_url) lines.push(`Affiliate link: ${item.data.affiliate_url}`, '');
    if (item.data.summary) lines.push(item.data.summary, '');
    const body = item.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  // Software — metadata + body
  lines.push('# Software', '', '---', '');
  for (const item of sortedSoftware) {
    const url = `${origin}/software/${item.id}`;
    lines.push(`## [${item.data.title}](${url})`, '');
    if (item.data.tags?.length) lines.push(`Tags: ${item.data.tags.join(', ')}`, '');
    if (item.data.project_url) lines.push(`Project link: ${item.data.project_url}`, '');
    if (item.data.summary) lines.push(item.data.summary, '');
    const body = item.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
