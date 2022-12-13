import { defineConfig } from "astro/config";
import { injectFrontmatter } from "./src/utils/remark";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [injectFrontmatter],

  },

});