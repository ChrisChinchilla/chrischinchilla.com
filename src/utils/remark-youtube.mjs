/**
 * Remark plugin to transform YouTube HTML comments into iframe embeds
 *
 * This plugin processes HTML comments in markdown that follow the pattern:
 *   <!-- youtube:VIDEO_ID -->
 * and converts them to embedded YouTube iframe players.
 */

import { visit } from 'unist-util-visit';

/**
 * Create HTML for YouTube iframe embed
 * Creates a responsive embed that works without JavaScript
 */
function createYouTubeIframe(videoId) {
  return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
}

/**
 * Remark plugin to transform YouTube HTML comments into iframe embeds
 */
export function remarkYouTube() {
  return (tree) => {
    visit(tree, 'html', (node) => {
      // Check if this HTML node contains a YouTube comment
      const match = node.value.match(/^<!--\s*youtube:([a-zA-Z0-9_-]{11})\s*-->$/);

      if (match) {
        const videoId = match[1];
        // Replace the HTML comment with an iframe embed
        node.value = createYouTubeIframe(videoId);
      }
    });
  };
}
