import { defineConfig } from "astro/config";
import react from '@astrojs/react';
import netlify from "@astrojs/netlify/functions";
import image from "@astrojs/image";

export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [],
      rehypePlugins: [],
      // syntaxHighlight: 'shiki'
      // syntaxHighlight: 'prism'
    
  },
  integrations: [ 
    react(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
  // output: "server",
  adapter: netlify()
});