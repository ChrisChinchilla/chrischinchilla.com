import type { RemarkPlugins } from "astro";

type Plugin = RemarkPlugins[number];

export const injectFrontmatter: Plugin = () => {
  return (tree, { data }) => {
    (data.astro as any).frontmatter.layout = "../../../layouts/Post.astro";
  };
};