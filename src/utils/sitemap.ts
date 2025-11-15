// Sitemap customization utility
// This function is called during build to customize sitemap entries

export function customizeSitemapItem(item: any) {
  // Extract path from URL
  const url = new URL(item.url);
  const path = url.pathname;

  // Set priority and changefreq based on page type
  if (path === '/') {
    item.priority = 1.0;
    item.changefreq = 'weekly';
  } else if (path.startsWith('/blog/') && !path.includes('/tag/') && !path.includes('/page/')) {
    // Individual blog posts
    item.priority = 0.8;
    item.changefreq = 'monthly';
    // Set lastmod to current date for now - in production you'd read file stats
    item.lastmod = new Date();
  } else if (path === '/blog' || path === '/blog/') {
    // Blog index
    item.priority = 0.9;
    item.changefreq = 'daily';
  } else if (path.startsWith('/podcast/')) {
    item.priority = 0.8;
    item.changefreq = 'monthly';
  } else if (path.startsWith('/books/')) {
    item.priority = 0.7;
    item.changefreq = 'monthly';
  } else {
    item.priority = 0.6;
    item.changefreq = 'monthly';
  }

  return item;
}
