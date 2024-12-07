import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import { remarkReadingTime } from './src/utils/frontmatter.mjs';
import { SITE } from './src/config.mjs';
// import react from "@astrojs/react";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  integrations: [
    icon({
      // TODO: Streamline to only include needed
      include: {
        tabler: ['brand-youtube', 'brand-medium', 'brand-patreon', 'brand-github', 'brand-linkedin', 'mail', 'brand-bluesky', 'brand-tiktok', 'brand-twitter', 'brand-threads', 'brand-mastodon','menu','chevron-down','rss','brand-discord','download','brand-facebook'],
        'simple-line-icons': ['social-spotify'],
        fa: ['podcast'],
        carbon: ['calendar-heat-map'],
        fluent: ['people-audience-20-filled'],
        ri: ['money-euro-circle-fill'],
        ph: ['pencil-circle-bold'],
        'simple-icons': ['applepodcasts', 'amazonmusic','pocketcasts']
      }
    }),
    tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap(), mdx(), ...whenExternalScripts(() => partytown({
    config: {
      forward: ['dataLayer.push']
    }
  }))], 
  markdown: {
    remarkPlugins: [remarkReadingTime],
    extendDefaultPlugins: true
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    }
  }
});