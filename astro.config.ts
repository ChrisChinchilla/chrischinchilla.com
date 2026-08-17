import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { remarkReadingTime } from './src/utils/frontmatter.mjs';
import { remarkR2Images } from './src/utils/remark-r2-images.mjs';
import { remarkYouTube } from './src/utils/remark-youtube.mjs';
import { customizeSitemapItem } from './src/utils/sitemap';
import { SITE } from './src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => any) | (() => any)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// Allow-list the R2 bucket's host so Astro's <Image> component can fetch and
// optimize R2-hosted images at build time, the same way it does local assets.
// astro.config.ts runs before Astro loads .env into process.env, so it's
// read explicitly here via Vite's loadEnv.
const { PUBLIC_R2_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const r2Hostname = (() => {
  try {
    return PUBLIC_R2_URL ? new URL(PUBLIC_R2_URL).hostname : undefined;
  } catch {
    return undefined;
  }
})();

// https://astro.build/config
export default defineConfig({
  image: {
    responsiveStyles: true,
    domains: r2Hostname ? [r2Hostname] : [],
  },
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  
  integrations: [
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
          'sun',
          'moon',
        ],
        'simple-line-icons': ['social-spotify'],
        fa: ['podcast'],
        carbon: ['calendar-heat-map'],
        fluent: ['people-audience-20-filled'],
        ri: ['money-euro-circle-fill'],
        ph: ['pencil-circle-bold', 'code-bold', 'music-notes-bold', 'dice-six-bold'],
        'simple-icons': ['applepodcasts', 'amazonmusic', 'pocketcasts'],
      },
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
    processor: unified({
      remarkPlugins: [remarkReadingTime, remarkR2Images, remarkYouTube],
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
    }),
  },
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
