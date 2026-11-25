// Netlify redirects for tag pages whose slug changed. Two sources:
//  - src/data/tag-redirects.json: old tag -> current tag, written by
//    `python3 normalize_tags.py --redirects-from <git-ref>` after a tag clean-up.
//  - US spellings: tags use British spelling, so /tag/humor redirects to /tag/humour.
//    Derived from the live tags, so new tags are covered without any edits here.

import { getCollection } from 'astro:content';
import { cleanSlug } from '~/utils/permalinks';
import tagRedirects from '~/data/tag-redirects.json';

const TAG_PAGES = {
  posts: { base: '/blog/tag', index: '/blog' },
  stories: { base: '/stories/tag', index: '/stories' },
  gear: { base: '/gear/tag', index: '/gear' },
  software: { base: '/software/tag', index: '/software' },
} as const;

// British -> American, per hyphen-separated slug word.
const US_WORDS: Record<string, string> = {
  humour: 'humor',
  centre: 'center',
  defence: 'defense',
  colour: 'color',
  behaviour: 'behavior',
  favourite: 'favorite',
  grey: 'gray',
  catalogue: 'catalog',
  theatre: 'theater',
  fibre: 'fiber',
  licence: 'license',
  analyse: 'analyze',
  analysing: 'analyzing',
  modelling: 'modeling',
  labelling: 'labeling',
  decentralised: 'decentralized',
  centralised: 'centralized',
  containerised: 'containerized',
};

const toUs = (word: string) => US_WORDS[word] ?? word.replace(/isation(s?)$/, 'ization$1');
export const usSlug = (slug: string) => slug.split('-').map(toUs).join('-');

export const getTagRedirectRules = async (): Promise<string[]> => {
  const rules = new Map<string, string>();

  for (const [collection, { base, index }] of Object.entries(TAG_PAGES)) {
    const entries = await getCollection(collection as keyof typeof TAG_PAGES);
    const slugs = new Set(entries.flatMap((entry) => (entry.data.tags ?? []).map((tag: string) => cleanSlug(tag))));

    for (const [oldTag, newTag] of Object.entries(tagRedirects) as [string, string | null][]) {
      const from = cleanSlug(oldTag);
      if (slugs.has(from)) continue;
      // Dropped tags only ever had pages on the blog.
      if (newTag === null) {
        if (collection === 'posts') rules.set(`${base}/${from}`, index);
        continue;
      }
      const to = cleanSlug(newTag);
      if (slugs.has(to) && from !== to) rules.set(`${base}/${from}`, `${base}/${to}`);
    }

    for (const slug of slugs) {
      const us = usSlug(slug);
      if (us !== slug && !slugs.has(us)) rules.set(`${base}/${us}`, `${base}/${slug}`);
    }

    // A redirect to a page that isn't built is a new 404, so fail the build instead.
    for (const [from, to] of rules) {
      if (!from.startsWith(`${base}/`) || to === index) continue;
      if (!slugs.has(to.slice(base.length + 1))) throw new Error(`Tag redirect ${from} points at missing page ${to}`);
    }
  }

  return [...rules].map(([from, to]) => `${from} ${to} 301`);
};
