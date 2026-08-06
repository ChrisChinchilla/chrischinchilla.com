/**
 * Remark plugin to transform inline markdown images to use Cloudflare R2
 *
 * This plugin processes image nodes in markdown/MDX and converts paths
 * to R2 public bucket URLs when applicable.
 *
 * Example:
 *   ![Alt text](articles/image.jpg)
 *   becomes
 *   ![Alt text](https://images.example.com/articles/image.jpg)
 */

import { visit } from 'unist-util-visit';

/**
 * Determine if an image should be loaded from R2 or local assets
 * (duplicated from r2-images.ts to avoid ESM/import issues)
 */
function shouldUseR2(imagePath) {
  if (!imagePath) return false;

  // If it's already a full URL (http/https), leave existing URLs alone
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return false;
  }

  // If it starts with /src/assets, it's a local asset
  if (imagePath.startsWith('/src/assets')) {
    return false;
  }

  // If it's a relative path starting with ./ or ../, it's local
  if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
    return false;
  }

  // Otherwise, assume it's an R2 path
  return true;
}

/**
 * Get the R2 URL for an image
 * (duplicated from r2-images.ts to avoid ESM/import issues)
 */
function getR2ImageUrl(path, config) {
  const { publicUrl, prefix } = config;

  if (!publicUrl) {
    console.warn(`R2 image requested but PUBLIC_R2_URL is not configured: ${path}`);
    return path; // Return original path if not configured
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullPath = prefix ? `${prefix}/${cleanPath}` : cleanPath;

  return `${publicUrl.replace(/\/$/, '')}/${fullPath}`;
}

/**
 * Remark plugin to transform image URLs to Cloudflare R2
 * Accepts config options that can be passed from astro.config
 */
export function remarkR2Images(options = {}) {
  return (tree) => {
    // Get config from environment variables
    // Note: import.meta.env is not available in Node context, so we use process.env
    const config = {
      publicUrl: options.publicUrl || process.env.PUBLIC_R2_URL,
      prefix: (options.prefix || process.env.PUBLIC_R2_IMAGES_PREFIX || '').replace(/^\/|\/$/g, ''),
    };

    visit(tree, 'image', (node) => {
      const imagePath = node.url;

      // Only process if this should use R2 (already-full URLs are left as-is)
      if (shouldUseR2(imagePath)) {
        node.url = getR2ImageUrl(imagePath, config);
      }
    });
  };
}
