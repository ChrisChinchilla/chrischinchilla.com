import type { RemarkPlugins } from "astro";

type Plugin = RemarkPlugins[number];

export const injectFrontmatter: Plugin = () => {
  return (tree, { data }) => {
    (data.astro as { frontmatter: Record<string, unknown> }).frontmatter.layout = "../../../layouts/Post.astro";
  };
};