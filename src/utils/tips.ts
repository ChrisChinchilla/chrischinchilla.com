import { getCollection } from 'astro:content';

export interface TipLink {
  label: string;
  url: string;
  icon?: string;
}

// Tip links come from the core support links in src/data/support.json that have a `tip_url`
// (currently Buy Me a Coffee and Ko-fi), so the URLs live in one place.
export async function getTipLinks(): Promise<TipLink[]> {
  const supportLinks = await getCollection('supportLinks');
  return supportLinks
    .filter((link) => link.data.section === 'core' && link.data.tip_url)
    .map((link) => ({
      label: link.data.tip_label ?? link.data.name ?? link.id,
      url: link.data.tip_url!,
      icon: link.data.tip_icon,
    }));
}

export function getTipHeading(subject: string): string {
  return `Tip me for ${subject}`;
}

export function tipLinksToMarkdown(subject: string, links: TipLink[]): string {
  if (links.length === 0) return '';
  return `${getTipHeading(subject)}: ${links.map((link) => `[${link.label}](${link.url})`).join(' | ')}`;
}
