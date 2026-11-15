import type { ImageMetadata } from 'astro';
const load = async function () {
  let images: Record<string, () => Promise<{ default: ImageMetadata }>> = {};
  try {
    images = import.meta.glob<{ default: ImageMetadata }>('~/assets/images/**');
  } catch {
    // continue regardless of error
  }
  return images;
};

let _images: ReturnType<typeof load> | undefined;

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

  return typeof images[key] === 'function' ? (await images[key]()).default : null;
};
