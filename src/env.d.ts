/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'markdown-truncate' {
  export default function truncateMarkdown(markdown: string, options: { limit: number; ellipsis?: boolean }): string;
}
