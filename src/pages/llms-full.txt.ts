import { getCollection, render } from 'astro:content';
import { SITE } from '~/config.mjs';

const origin = SITE.origin;

function entryUrl(localPath: string, publicationUrl?: string): string {
  return publicationUrl ?? `${origin}${localPath}`;
}

async function renderBody(entry: any): Promise<string> {
  try {
    const { remarkPluginFrontmatter, ...rest } = await render(entry);
    // render() gives us the compiled component; extract raw body via the entry
    return entry.body ?? '';
  } catch {
    return '';
  }
}

function sectionSeparator(title: string, url: string, date: string, summary?: string): string {
  const lines = [`## [${title}](${url})`, ``, `Date: ${date}`];
  if (summary) lines.push(``, summary);
  lines.push('', '---', '');
  return lines.join('\n');
}

export const GET = async () => {
  const [posts, stories, newsletters, books, av] = await Promise.all([
    getCollection('posts'),
    getCollection('stories'),
    getCollection('newsletters'),
    getCollection('books'),
    getCollection('av'),
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

  const sortedAv = av
    .sort((a, b) => new Date(b.data.publish_date).valueOf() - new Date(a.data.publish_date).valueOf());

  const lines: string[] = [
    `# ${SITE.name} — Full Content`,
    '',
    `> ${SITE.description}`,
    '',
    `> Index at [${origin}/llms.txt](${origin}/llms.txt)`,
    '',
  ];

  // Blog Posts
  lines.push('# Blog Posts', '', '---', '');
  for (const post of sortedPosts) {
    const url = entryUrl(`/blog/${post.id}`, post.data.publication_url);
    const date = post.data.publishDate ? new Date(post.data.publishDate).toISOString().split('T')[0] : 'unknown';

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

  // Books — metadata only, no body to render
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
    const body = item.body ?? '';
    if (body) lines.push(body, '');
    lines.push('---', '');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
