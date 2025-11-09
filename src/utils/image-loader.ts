/**
 * Image Loader Utility
 *
 * Dynamically imports local images so Astro can infer their dimensions.
 * This allows us to use image paths as strings in content frontmatter
 * while still getting the benefits of Astro's image optimization.
 */

import type { ImageMetadata } from 'astro';

// Base path for local images
const LOCAL_IMAGES_PATH = '/src/assets/images';

// Cache the glob result (persists across builds for performance)
let imageCache: Record<string, ImageMetadata> | null = null;

/**
 * Load all images from src/assets/images using Vite's glob import
 * Images are cached after first load for performance
 */
async function loadAllImages(): Promise<Record<string, ImageMetadata>> {
  if (imageCache) {
    return imageCache;
  }

  // Use Vite's glob import to load all images at build time
  // eager: true is required because images are resolved during SSG, not runtime
  const images = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp,avif}',
    { eager: true }
  );

  // Convert the glob results to a path -> ImageMetadata map
  imageCache = Object.fromEntries(Object.entries(images).map(([path, module]) => [path, module.default]));

  return imageCache;
}

/**
 * Get an ImageMetadata object for a local image path
 *
 * @param imagePath - Path to the image (e.g., "/src/assets/images/articles/hero.jpg")
 * @returns ImageMetadata object or null if not found
 *
 * @example
 * ```ts
 * const image = await getLocalImage('/src/assets/images/articles/hero.jpg');
 * if (image) {
 *   // Use with Astro's Image component with inferSize
 * }
 * ```
 */
export async function getLocalImage(imagePath: string): Promise<ImageMetadata | null> {
  if (!imagePath || !imagePath.startsWith('/src/assets/images')) {
    return null;
  }

  const images = await loadAllImages();
  return images[imagePath] || null;
}

/**
 * Resolve an image path to either an ImageMetadata object (for local images)
 * or the original path (for external URLs or Supabase paths)
 *
 * @param imagePath - The image path or URL
 * @returns ImageMetadata object for local images, or the original string for others
 *
 * @example
 * ```ts
 * // Local image - returns ImageMetadata
 * const img1 = await resolveImage('/src/assets/images/hero.jpg');
 *
 * // Supabase path - returns string
 * const img2 = await resolveImage('posts/hero.jpg');
 *
 * // External URL - returns string
 * const img3 = await resolveImage('https://example.com/image.jpg');
 * ```
 */
export async function resolveImage(
  imagePath: string | ImageMetadata | undefined
): Promise<ImageMetadata | string | undefined> {
  // Already an ImageMetadata object
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Try to load as local image
  if (imagePath.startsWith('/src/assets/images')) {
    const localImage = await getLocalImage(imagePath);
    if (localImage) {
      return localImage;
    }
  }

  // Return as-is for external URLs or Supabase paths
  return imagePath;
}

/**
 * Check if an image is a local asset path
 */
export function isLocalImagePath(imagePath: string | ImageMetadata | undefined): boolean {
  return typeof imagePath === 'string' && imagePath.startsWith('/src/assets/images');
}
