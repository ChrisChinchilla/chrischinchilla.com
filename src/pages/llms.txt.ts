import { getCollection } from 'astro:content';
import { SITE } from '~/config.mjs';

const origin = SITE.origin;

function entryUrl(localPath: string, publicationUrl?: string): string {
  return publicationUrl ?? `${origin}${localPath}`;
}

function formatLink(title: string, url: string, summary?: string): string {
  const desc = summary ? ` — ${summary.replace(/\n/g, ' ').trim()}` : '';
  return `- [${title}](${url})${desc}`;
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
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `> Full content available at [${origin}/llms-full.txt](${origin}/llms-full.txt)`,
    '',
  ];

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

  // Books
  lines.push('## Books', '');
  for (const book of sortedBooks) {
    const externalUrl = book.data.publication_url ?? book.data.store_urls?.[0]?.url;
    const url = entryUrl(`/books/${book.id}`, externalUrl);
    lines.push(formatLink(book.data.title, url, book.data.summary));
  }
  lines.push('');

  // AV / Courses
  lines.push('## Video Courses & Audio/Visual', '');
  for (const item of sortedAv) {
    const url = item.data.store_urls?.[0]?.url ?? `${origin}/videos/${item.id}`;
    lines.push(formatLink(item.data.title, url));
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
