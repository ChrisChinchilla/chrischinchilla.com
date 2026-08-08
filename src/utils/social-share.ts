// Share-intent URL builders for the ShareLinks component.
// Mastodon has no single share endpoint (it's federated), so it's built
// separately from the visitor-supplied instance domain — see buildMastodonShareText.

export type ShareNetwork = 'twitter' | 'linkedin' | 'bluesky' | 'threads';

export const SOCIAL_HANDLES: Record<ShareNetwork | 'mastodon', string> = {
  twitter: 'chrischinch',
  linkedin: 'chrischinchilla',
  mastodon: 'chrischinchilla@mastodon.social',
  bluesky: 'chrischinchilla.bsky.social',
  threads: 'chrischinchilla',
};

export interface ShareContent {
  title: string;
  url: string;
  summary?: string;
}

export const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, '').trim();

const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
};

const buildText = (content: ShareContent, mention?: string): string => {
  const parts = [content.title];
  if (content.summary) parts.push(truncate(content.summary, 120));
  if (mention) parts.push(`via ${mention}`);
  return parts.join(' — ');
};

const withParams = (base: string, params: Record<string, string>): string => {
  const shareUrl = new URL(base);
  for (const [key, value] of Object.entries(params)) shareUrl.searchParams.set(key, value);
  return shareUrl.toString();
};

export const buildShareUrl = (network: ShareNetwork, content: ShareContent): string => {
  const { url, title } = content;

  switch (network) {
    case 'twitter':
      return withParams('https://twitter.com/intent/tweet', {
        url,
        text: buildText(content),
        via: SOCIAL_HANDLES.twitter,
      });

    case 'linkedin':
      return withParams('https://www.linkedin.com/shareArticle', {
        mini: 'true',
        url,
        title,
        summary: buildText(content, SOCIAL_HANDLES.linkedin),
        source: 'chrischinchilla.com',
      });

    case 'bluesky':
      return withParams('https://bsky.app/intent/compose', {
        text: `${buildText(content, `@${SOCIAL_HANDLES.bluesky}`)} ${url}`,
      });

    case 'threads':
      return withParams('https://www.threads.net/intent/post', {
        text: `${buildText(content, `@${SOCIAL_HANDLES.threads}`)} ${url}`,
      });
  }
};

/** Mastodon has no fixed share host, so the share text is built here and the
 * instance domain (supplied by the visitor at click time) is combined with it
 * client-side to form `https://<instance>/share?text=...`. */
export const buildMastodonShareText = (content: ShareContent): string =>
  `${buildText(content, `@${SOCIAL_HANDLES.mastodon}`)} ${content.url}`;
