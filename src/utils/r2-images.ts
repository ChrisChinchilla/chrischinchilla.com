/**
 * Cloudflare R2 Image Utilities
 *
 * Helper functions for working with images stored in a Cloudflare R2 bucket,
 * served via a public bucket URL (r2.dev subdomain or a custom domain).
 */

/**
 * Configuration for the R2 image service
 */
interface R2ImageConfig {
  publicUrl: string;
  prefix: string;
}

/**
 * Image transformation options.
 * Applied via Cloudflare's Image Resizing (`/cdn-cgi/image/...`), which requires
 * the public URL to be served through a Cloudflare zone with Image Resizing enabled.
 * @see https://developers.cloudflare.com/images/transform-images/
 */
interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'origin' | 'webp' | 'avif';
  resize?: 'cover' | 'contain' | 'fill';
}

// Maps our `resize` option onto Cloudflare Image Resizing's `fit` values.
const RESIZE_TO_FIT: Record<NonNullable<ImageTransformOptions['resize']>, string> = {
  cover: 'cover',
  contain: 'contain',
  fill: 'scale-down',
};

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
 * Build the Cloudflare Image Resizing path segment for a set of transform options
 */
function buildTransformSegment(options?: ImageTransformOptions): string {
  if (!options) return '';

  const params: string[] = [];

  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.format && options.format !== 'origin') params.push(`format=${options.format}`);
  if (options.resize) params.push(`fit=${RESIZE_TO_FIT[options.resize]}`);

  return params.length ? `cdn-cgi/image/${params.join(',')}/` : '';
}

/**
 * Get the full URL for an image stored in the R2 bucket
 *
 * @param path - The path to the image within the bucket (e.g., "posts/my-image.jpg")
 * @param options - Optional transformation parameters
 * @returns The full URL to the image
 *
 * @example
 * ```ts
 * // Basic usage
 * const url = getR2ImageUrl('posts/hero.jpg');
 *
 * // With transformations
 * const url = getR2ImageUrl('posts/hero.jpg', {
 *   width: 800,
 *   quality: 80,
 *   format: 'webp'
 * });
 * ```
 */
export function getR2ImageUrl(path: string, options?: ImageTransformOptions): string {
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
  const transformSegment = buildTransformSegment(options);

  return `${publicUrl}/${transformSegment}${fullPath}`;
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
 * Get responsive image URLs for different screen sizes
 *
 * @param path - The path to the image within the bucket
 * @param widths - Array of widths to generate (defaults to common breakpoints)
 * @returns Object with width keys and corresponding URLs
 *
 * @example
 * ```ts
 * const sources = getResponsiveImageUrls('posts/hero.jpg');
 * // Returns: { 640: 'url...', 768: 'url...', 1024: 'url...', etc. }
 * ```
 *
 * @internal Reserved for future use with responsive images
 */
export function getResponsiveImageUrls(
  path: string,
  widths: number[] = [640, 768, 1024, 1280, 1536]
): Record<number, string> {
  return widths.reduce(
    (acc, width) => {
      acc[width] = getR2ImageUrl(path, { width, format: 'webp' });
      return acc;
    },
    {} as Record<number, string>
  );
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
 * @param options - Optional transformation parameters (only applied for R2 images)
 * @returns The image URL or original path
 */
export function getImageUrl(imagePath: string, options?: ImageTransformOptions): string {
  if (shouldUseR2(imagePath)) {
    // If it's already a full URL, return it as-is (e.g. a pre-existing external URL)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, construct the R2 URL
    return getR2ImageUrl(imagePath, options);
  }

  // Return local path as-is
  return imagePath;
}
