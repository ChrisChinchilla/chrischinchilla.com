import { getCollection } from 'astro:content';

type SupportLink = Awaited<ReturnType<typeof getCollection<'supportLinks'>>>[number];

/**
 * A single random sponsor as one Markdown block, for the Markdown renditions of pages
 * (llms-full.txt and the "Copy as Markdown" menu item). Only affiliate entries are used: they
 * have a title, description and plain link, unlike the "core" entries, which are raw widget HTML.
 * The pick is random per call, so it changes at every build.
 */
export async function getRandomSponsorMarkdown(): Promise<string> {
  const links = (await getCollection('supportLinks')).filter((link) => link.data.affiliate_link);
  if (links.length === 0) return '';
  return sponsorToMarkdown(links[Math.floor(Math.random() * links.length)]);
}

export function sponsorToMarkdown(link: SupportLink): string {
  const { title, cta, description, affiliate_link } = link.data;
  const text = (description ?? '').replace(/\s+/g, ' ').trim();
  return `**Sponsored:** [${title ?? cta}](${affiliate_link})${text ? ` — ${text}` : ''}`;
}
