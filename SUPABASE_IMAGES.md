# Supabase Storage Images Integration

This site supports a hybrid approach to image management, allowing you to use both local Astro assets and Supabase Storage images.

## Quick Start

### 1. Configure Supabase

Add your Supabase project URL to `.env`:

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_IMAGES_BUCKET=images  # Optional, defaults to 'images'
```

### 2. Set Up Your Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `images` (or use your custom bucket name)
4. Make it **public** if you want images to be publicly accessible
5. Upload your images organized by folder (e.g., `posts/`, `podcasts/`, `newsletters/`)

### 3. Use Images in Your Content

#### Option A: In Frontmatter (Easiest)

You can now use Supabase paths directly in your content frontmatter:

```yaml
---
title: My Awesome Post
# Supabase path (no /src/ prefix, no quotes needed)
image: posts/my-hero-image.jpg

# OR use full URL (quotes optional)
image: https://xxx.supabase.co/storage/v1/object/public/images/posts/hero.jpg

# Local images (use path without quotes for best optimization)
image: /src/assets/images/articles/local-image.jpg
---
```

**Important Notes:**
- **Supabase images**: Use simple paths like `posts/image.jpg` (no `/src/` prefix)
- **Local images**: Use paths like `/src/assets/images/...` 
- **No quotes needed**: While quotes work, omitting them allows Astro to better optimize local images
- The system automatically detects whether it's a local path or a Supabase path

#### Option B: Using the SupabaseImage Component

For more control in your Astro components:

```astro
---
import SupabaseImage from '~/components/common/SupabaseImage.astro';
---

<!-- Simple usage -->
<SupabaseImage 
  src="posts/my-article.jpg" 
  alt="Article hero" 
  width={800} 
  height={600} 
/>

<!-- With transformations for optimization -->
<SupabaseImage 
  src="posts/large-image.jpg" 
  alt="Optimized image"
  width={800}
  height={600}
  quality={80}
  format="webp"
/>

<!-- Local images still work the same -->
<SupabaseImage 
  src={import('~/assets/images/logo.png')} 
  alt="Logo" 
  width={200} 
  height={100} 
/>
```

#### Option C: Using the ContentImage Component (Recommended)

The `ContentImage` component provides smart defaults for different content types:

```astro
---
import ContentImage from '~/components/common/ContentImage.astro';
---

<!-- Automatically uses default fallback if no image -->
<ContentImage 
  src={post.data.image} 
  alt={post.data.title}
  type="post"
  width={800}
  height={600}
/>

<!-- Works with Supabase paths -->
<ContentImage 
  src="newsletters/2024-01.jpg" 
  alt="Newsletter"
  type="newsletter"
  format="webp"
  quality={85}
/>
```

## Image Organization Strategy

### Keep Local (Recommended)
- **Logos and branding** - `/src/assets/images/chinch-head.svg`, etc.
- **Default/fallback images** - `/src/assets/images/defaults/`
- **Site UI elements** - Icons, backgrounds, etc.
- **Critical above-the-fold images** - For faster initial page loads

### Move to Supabase (Recommended)
- **Blog post images** - Large content images
- **Podcast artwork** - Episode-specific images
- **Newsletter headers** - Regular newsletter images
- **Book covers** - If frequently updated
- **Game screenshots** - Large media files
- **Video thumbnails** - AV content images

## Utility Functions

If you need direct access to Supabase URLs in your code:

```typescript
import { 
  getSupabaseImageUrl, 
  getResponsiveImageUrls,
  shouldUseSupabase,
  isSupabaseImageUrl 
} from '~/utils/supabase-images';

// Get a single image URL
const url = getSupabaseImageUrl('posts/hero.jpg', {
  width: 800,
  quality: 80,
  format: 'webp'
});

// Get multiple responsive sizes
const sources = getResponsiveImageUrls('posts/hero.jpg');
// Returns: { 640: 'url...', 768: 'url...', 1024: 'url...', etc. }

// Check if a path should use Supabase
if (shouldUseSupabase('posts/image.jpg')) {
  // Handle Supabase image
}

// Check if a URL is a Supabase URL
if (isSupabaseImageUrl(someUrl)) {
  // It's from Supabase
}
```

## Image Transformations

Supabase Storage supports on-the-fly image transformations:

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| `width` | number | Resize width | `width: 800` |
| `height` | number | Resize height | `height: 600` |
| `quality` | number (1-100) | JPEG/WebP quality | `quality: 80` |
| `format` | string | Output format | `format: 'webp'` |
| `resize` | string | Resize mode | `resize: 'cover'` |

**Formats:** `origin`, `webp`, `avif`  
**Resize modes:** `cover`, `contain`, `fill`

## Migration Strategy

### Gradual Migration Approach

1. **Start with new content** - Use Supabase for all new blog posts, podcasts, etc.
2. **Migrate heavy content** - Move large images first to free up repo space
3. **Keep local for now** - Don't rush to migrate everything
4. **Test thoroughly** - Ensure Supabase URLs work before removing local files

### Example Migration Script

```bash
# 1. Upload images to Supabase Storage
# Use Supabase CLI or dashboard

# 2. Update frontmatter in content files
# Change from:
# image: /src/assets/images/articles/my-post.jpg
# To:
# image: posts/my-post.jpg

# 3. Test locally
npm run dev

# 4. Once verified, optionally remove local files
```

## Best Practices

### Performance
- Use `quality: 80-85` for good balance of quality and file size
- Prefer `webp` format for modern browsers
- Specify explicit `width` and `height` to prevent layout shift
- Use `loading="lazy"` for images below the fold (default)

### Organization
Structure your Supabase bucket to mirror content types:
```
images/
├── posts/
│   ├── 2024/
│   └── 2025/
├── podcasts/
├── newsletters/
├── books/
├── games/
└── clients/
```

### Security
- Use **public buckets** for publicly accessible images
- Use **private buckets** with signed URLs for restricted content
- Never commit your Supabase API keys (only `PUBLIC_SUPABASE_URL` is needed for public images)

### Fallbacks
- Always provide an `alt` attribute
- The `ContentImage` component automatically falls back to default images
- Keep default images local for reliability

## Troubleshooting

### Images not loading
1. Check `PUBLIC_SUPABASE_URL` is set in `.env`
2. Verify the bucket is public in Supabase dashboard
3. Check the image path matches the Supabase storage structure
4. Look for CORS errors in browser console

### Build errors
1. Ensure Astro can distinguish between local and remote images
2. Check that local image imports use the correct path
3. Verify all required props are provided

### Performance issues
1. Use appropriate image transformations
2. Enable CDN caching in Supabase
3. Consider using `avif` format for better compression
4. Implement responsive image sizes

## Example: Converting Existing Component

**Before:**
```astro
---
import { Image } from 'astro:assets';
import defaultImage from '~/assets/images/defaults/blog-chinchilla.jpg';

const { post } = Astro.props;
const postImage = post.data.image || defaultImage;
---

<Image 
  src={postImage} 
  alt={post.data.title} 
  width={800} 
  height={600}
  inferSize={true}
/>
```

**After:**
```astro
---
import ContentImage from '~/components/common/ContentImage.astro';

const { post } = Astro.props;
---

<ContentImage 
  src={post.data.image} 
  alt={post.data.title} 
  type="post"
  width={800} 
  height={600}
  quality={85}
  format="webp"
/>
```

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Astro Image Documentation](https://docs.astro.build/en/guides/images/)
