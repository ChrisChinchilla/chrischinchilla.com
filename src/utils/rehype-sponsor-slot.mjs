/**
 * Rehype plugin: marks where the sponsor ("support my work") block belongs in an article.
 *
 * Inserts an empty `<div data-sponsor-slot>` after the second top-level paragraph of posts and
 * stories (or at the end of the body when there are fewer than two paragraphs). The marker is
 * swapped for the real, Astro-rendered SupportBlock in `MarkdownLayout.astro`, which splits the
 * rendered slot HTML at this marker. Other content types are left untouched.
 */

const SLOT_COLLECTIONS = /[\\/]src[\\/]content[\\/](posts|stories)[\\/]/;

export function rehypeSponsorSlot() {
  return (tree, file) => {
    const path = file?.path ?? file?.history?.[0] ?? '';
    if (!SLOT_COLLECTIONS.test(path)) return;

    const marker = {
      type: 'element',
      tagName: 'div',
      properties: { dataSponsorSlot: '' },
      children: [],
    };

    let paragraphs = 0;
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'element' && node.tagName === 'p') {
        paragraphs += 1;
        if (paragraphs === 2) {
          tree.children.splice(i + 1, 0, marker);
          return;
        }
      }
    }
    tree.children.push(marker);
  };
}
