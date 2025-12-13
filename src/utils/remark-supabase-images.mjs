/**
 * Remark plugin to transform inline markdown images to use Supabase Storage
 *
 * This plugin processes image nodes in markdown/MDX and converts paths
 * to Supabase Storage URLs when applicable.
 *
 * Example:
 *   ![Alt text](articles/image.jpg)
 *   becomes
 *   ![Alt text](https://xxx.supabase.co/storage/v1/object/public/images/articles/image.jpg)
 */

import { visit } from 'unist-util-visit';

/**
 * Determine if an image should be loaded from Supabase or local assets
 * (duplicated from supabase-images.ts to avoid ESM/import issues)
 */
function shouldUseSupabase(imagePath) {
  if (!imagePath) return false;

  // If it's already a full URL (http/https), check if it's Supabase
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath.includes('/storage/v1/object/');
  }

  // If it starts with /src/assets, it's a local asset
  if (imagePath.startsWith('/src/assets')) {
    return false;
  }

  // If it's a relative path starting with ./ or ../, it's local
  if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
    return false;
  }

  // Otherwise, assume it's a Supabase path
  return true;
}

/**
 * Get the Supabase URL for an image
 * (duplicated from supabase-images.ts to avoid ESM/import issues)
 */
function getSupabaseImageUrl(path, config) {
  const { projectUrl, bucket } = config;

  if (!projectUrl) {
    console.warn(`Supabase image requested but PUBLIC_SUPABASE_URL is not configured: ${path}`);
    return path; // Return original path if not configured
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${projectUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

/**
 * Remark plugin to transform image URLs to Supabase Storage
 * Accepts config options that can be passed from astro.config
 */
export function remarkSupabaseImages(options = {}) {
  return (tree) => {
    // Get config from environment variables
    // Note: import.meta.env is not available in Node context, so we use process.env
    const config = {
      projectUrl: options.projectUrl || process.env.PUBLIC_SUPABASE_URL,
      bucket: options.bucket || process.env.PUBLIC_SUPABASE_IMAGES_BUCKET || 'images',
    };

    visit(tree, 'image', (node) => {
      const imagePath = node.url;

      // Only process if this should use Supabase
      if (shouldUseSupabase(imagePath)) {
        // If it's already a full Supabase URL, leave it as-is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return;
        }

        // Convert to Supabase URL
        node.url = getSupabaseImageUrl(imagePath, config);
      }
    });
  };
}
