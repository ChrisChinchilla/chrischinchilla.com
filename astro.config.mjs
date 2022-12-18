import { defineConfig } from "astro/config";
import { injectFrontmatter } from "./src/utils/remark";
import react from '@astrojs/react';

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [injectFrontmatter]
  },
  integrations: [react()],
  output: "server",
  adapter: netlify()
});