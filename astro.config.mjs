import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig,squooshImageService } from 'astro/config';
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
  // TODO: Fix this issue with netlify
  image: {
    service: squooshImageService(),
  },
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  integrations: [
    icon({
      // TODO: Streamline to only include needed
      include: {
        tabler: ['*'],
        'simple-line-icons': ['*'],
        fa: ['*'],
        carbon: ['*'],
        fluent: ['*'],
        ri: ['*'],
        ph: ['*'],
        'simple-icons': ['*']
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