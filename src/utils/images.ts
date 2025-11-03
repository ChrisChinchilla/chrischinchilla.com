const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**');
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images;

/** */
export const fetchLocalImages = async () => {
  _images = _images || load();
  return await _images;
};

/** */
export const findImage = async (imagePath?: string) => {
  if (typeof imagePath !== 'string') {
    return null;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (!imagePath.startsWith('~/assets')) {
    return null;
  } // For now only consume images using ~/assets alias (or absolute)

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return typeof images[key] === 'function' ? (await images[key]())['default'] : null;
};

/**
 * Extract the first image from markdown/MDX content
 * Returns the image path or null if no image found
 */
export const extractFirstImage = (content: string): string | null => {
  // Ensure content is a string
  if (typeof content !== 'string') {
    return null;
  }
  
  // Match markdown image syntax: ![alt](path)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = content.match(markdownImageRegex);
  
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }

  // Match HTML img tag: <img src="path"
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/;
  const htmlMatch = content.match(htmlImageRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  // Match Astro Image component: <Image src={...} or src="..."
  const astroImageRegex = /<Image[^>]+src=["'{]([^"'}]+)["'}]/;
  const astroMatch = content.match(astroImageRegex);
  
  if (astroMatch && astroMatch[1]) {
    return astroMatch[1];
  }

  return null;
};
