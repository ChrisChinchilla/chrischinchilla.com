import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { remarkReadingTime } from './src/utils/frontmatter.mjs';
import { remarkSupabaseImages } from './src/utils/remark-supabase-images.mjs';
import { remarkYouTube } from './src/utils/remark-youtube.mjs';
import { customizeSitemapItem } from './src/utils/sitemap';
import { SITE } from './src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => any) | (() => any)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// https://astro.build/config
export default defineConfig({
  image: {
    responsiveStyles: true,
  },
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  
  integrations: [
    react(),
    icon({
      include: {
        tabler: [
          'brand-youtube',
          'brand-medium',
          'brand-patreon',
          'brand-github',
          'brand-linkedin',
          'mail',
          'brand-bluesky',
          'brand-tiktok',
          'brand-twitter',
          'brand-threads',
          'brand-mastodon',
          'menu',
          'chevron-down',
          'rss',
          'brand-discord',
          'download',
          'brand-facebook',
        ],
        'simple-line-icons': ['social-spotify'],
        fa: ['podcast'],
        carbon: ['calendar-heat-map'],
        fluent: ['people-audience-20-filled'],
        ri: ['money-euro-circle-fill'],
        ph: ['pencil-circle-bold'],
        'simple-icons': ['applepodcasts', 'amazonmusic', 'pocketcasts'],
      },
    }),
    
    tailwind({
      applyBaseStyles: false,
    }),
    
    sitemap({
      serialize: customizeSitemapItem,
    }),
    
    mdx(),
    
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push'],
        },
      })
    ),
  ],
  
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkSupabaseImages, remarkYouTube],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-link'],
          },
        },
      ],
    ],
  },
  
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
