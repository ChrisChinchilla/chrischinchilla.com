/**
 * Cloudflare R2 Image Utilities
 *
 * Helper functions for working with images stored in a Cloudflare R2 bucket,
 * served via a public bucket URL (r2.dev subdomain or a custom domain).
 *
 * Resizing/format optimization is handled by Astro's <Image> component at
 * build time (see astro.config.ts `image.domains`), not by these helpers —
 * they only resolve the plain object URL.
 */

/**
 * Configuration for the R2 image service
 */
interface R2ImageConfig {
  publicUrl: string;
  prefix: string;
}

/**
 * Get R2 configuration from environment variables
 */
function getR2Config(): R2ImageConfig | null {
  const publicUrl = import.meta.env.PUBLIC_R2_URL;
  const prefix = import.meta.env.PUBLIC_R2_IMAGES_PREFIX || '';

  if (!publicUrl) {
    return null;
  }

  return { publicUrl: publicUrl.replace(/\/$/, ''), prefix: prefix.replace(/^\/|\/$/g, '') };
}

/**
 * Get the full URL for an image stored in the R2 bucket
 *
 * @param path - The path to the image within the bucket (e.g., "posts/my-image.jpg")
 * @returns The full URL to the image
 *
 * @example
 * ```ts
 * const url = getR2ImageUrl('posts/hero.jpg');
 * ```
 */
export function getR2ImageUrl(path: string): string {
  const config = getR2Config();

  if (!config) {
    // Return a placeholder or warning URL when R2 is not configured
    console.warn(`R2 image requested but PUBLIC_R2_URL is not configured: ${path}`);
    // Return a data URL placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ER2 not configured: ${encodeURIComponent(path)}%3C/text%3E%3C/svg%3E`;
  }

  const { publicUrl, prefix } = config;

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullPath = prefix ? `${prefix}/${cleanPath}` : cleanPath;

  return `${publicUrl}/${fullPath}`;
}

/**
 * Check if a URL points at the configured R2 public bucket
 *
 * @param url - The URL to check
 * @returns True if the URL is an R2 storage URL
 */
export function isR2ImageUrl(url: string): boolean {
  const config = getR2Config();
  if (!config) return false;
  return url.startsWith(config.publicUrl);
}

/**
 * Helper to determine if an image should be loaded from R2 or local assets
 *
 * @param imagePath - The image path (can be local path or URL)
 * @returns True if the image should be loaded from R2
 */
export function shouldUseR2(imagePath: string | undefined): boolean {
  if (!imagePath) return false;

  // If it's already a full URL (http/https), check if it's an R2 URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return isR2ImageUrl(imagePath);
  }

  // If it starts with /src/assets, it's a local asset
  if (imagePath.startsWith('/src/assets')) {
    return false;
  }

  // Otherwise, assume it's an R2 path
  return true;
}

/**
 * Get image URL, automatically choosing between R2 and local based on path
 *
 * @param imagePath - The image path
 * @returns The image URL or original path
 */
export function getImageUrl(imagePath: string): string {
  if (shouldUseR2(imagePath)) {
    // If it's already a full URL, return it as-is (e.g. a pre-existing external URL)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, construct the R2 URL
    return getR2ImageUrl(imagePath);
  }

  // Return local path as-is
  return imagePath;
}
