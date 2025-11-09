/**
 * Supabase Storage Image Utilities
 *
 * Helper functions for working with images stored in Supabase Storage.
 * Supports public and private buckets with optional transformations.
 */

/**
 * Configuration for Supabase image service
 */
interface SupabaseImageConfig {
  projectUrl: string;
  bucket: string;
}

/**
 * Image transformation options supported by Supabase
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */
interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'origin' | 'webp' | 'avif';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Get Supabase configuration from environment variables
 */
function getSupabaseConfig(): SupabaseImageConfig | null {
  const projectUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const bucket = import.meta.env.PUBLIC_SUPABASE_IMAGES_BUCKET || 'images';

  if (!projectUrl) {
    return null;
  }

  return { projectUrl, bucket };
}

/**
 * Build query parameters for image transformations
 */
function buildTransformParams(options?: ImageTransformOptions): string {
  if (!options) return '';

  const params = new URLSearchParams();

  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);
  if (options.resize) params.append('resize', options.resize);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Get the full URL for an image stored in Supabase public bucket
 *
 * @param path - The path to the image within the bucket (e.g., "posts/my-image.jpg")
 * @param options - Optional transformation parameters
 * @returns The full URL to the image
 *
 * @example
 * ```ts
 * // Basic usage
 * const url = getSupabaseImageUrl('posts/hero.jpg');
 *
 * // With transformations
 * const url = getSupabaseImageUrl('posts/hero.jpg', {
 *   width: 800,
 *   quality: 80,
 *   format: 'webp'
 * });
 * ```
 */
export function getSupabaseImageUrl(path: string, options?: ImageTransformOptions): string {
  const config = getSupabaseConfig();

  if (!config) {
    // Return a placeholder or warning URL when Supabase is not configured
    console.warn(`Supabase image requested but PUBLIC_SUPABASE_URL is not configured: ${path}`);
    // Return a data URL placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESupabase not configured: ${encodeURIComponent(path)}%3C/text%3E%3C/svg%3E`;
  }

  const { projectUrl, bucket } = config;

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  const baseUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
  const transformParams = buildTransformParams(options);

  return `${baseUrl}${transformParams}`;
}

/**
 * Check if a URL is a Supabase storage URL
 *
 * @param url - The URL to check
 * @returns True if the URL is a Supabase storage URL
 */
export function isSupabaseImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes('/storage/v1/object/');
  } catch {
    return false;
  }
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
      acc[width] = getSupabaseImageUrl(path, { width, format: 'webp' });
      return acc;
    },
    {} as Record<number, string>
  );
}

/**
 * Helper to determine if an image should be loaded from Supabase or local assets
 *
 * @param imagePath - The image path (can be local path or URL)
 * @returns True if the image should be loaded from Supabase
 */
export function shouldUseSupabase(imagePath: string | undefined): boolean {
  if (!imagePath) return false;

  // If it's already a full URL (http/https), check if it's Supabase
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return isSupabaseImageUrl(imagePath);
  }

  // If it starts with /src/assets, it's a local asset
  if (imagePath.startsWith('/src/assets')) {
    return false;
  }

  // Otherwise, assume it's a Supabase path
  return true;
}

/**
 * Get image URL, automatically choosing between Supabase and local based on path
 *
 * @param imagePath - The image path
 * @param options - Optional transformation parameters (only applied for Supabase images)
 * @returns The image URL or original path
 */
export function getImageUrl(imagePath: string, options?: ImageTransformOptions): string {
  if (shouldUseSupabase(imagePath)) {
    // If it's already a full Supabase URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, construct the Supabase URL
    return getSupabaseImageUrl(imagePath, options);
  }

  // Return local path as-is
  return imagePath;
}
