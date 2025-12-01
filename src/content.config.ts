import { z, defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { start } from 'repl';
// TODO: This used to be possible
// import defaultBlogImage from '~/src/assets/images/defaults/blog-chinchilla.jpg'

const supportLinks = defineCollection({
  loader: file('src/data/support.json'),
  schema: ({ image }) =>
    z.object({
      section: z.string(),
      name: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      cta: z.string().optional(),
      affiliate_link: z.string().url().optional(),
      affiliate_html: z.string().optional(),
      image: z.union([z.string().url(), image()]).optional(),
      icon: z.string().optional(),
      slug: z.string(),
    }),
});

const posts = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // description: z.string().optional(),
      // TODO: This used to be possible
      // image: image().optional().default(defaultBlogImage),
      image: image().optional(),
      publication_url: z.string().url().optional(),
      summary: z.string().optional(),
      // canonical: z.string().url().optional(),

      publishDate: z.date().or(z.string()).optional(),
      // draft: z.boolean().optional(),

      // excerpt: z.string().optional(),
      // category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      // author: z.string().optional(),

      // Hero carousel properties
      herotext: z.string().optional(),
      heroimage: image().optional(),
    }),
});

const games = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/games' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: z.union([z.string().url(), image()]),
      publisher: z.string().optional(),
      store_urls: z.array(z.object({ url: z.string(), label: z.string() })).optional(),
      publish_date: z.date().optional(),
      role: z.string(),
    }),
});

const events = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      action: z.string().optional(),
      event: z.string(),
      start_date: z.date(),
      end_date: z.date().optional(),
      venue: z.string().optional(),
      pres_source: z.string().optional(),
      pres_url: z.string().optional(),
      publication_url: z.string().url().optional(),

      // Hero carousel properties
      herotext: z.string().optional(),
      heroimage: image().optional(),
    }),
});

const clients = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/clients' }),
  schema: ({ image }) =>
    z.object({
      type: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      description: z.string().optional(),
      image: z.union([z.string().url(), image()]),
      company_url: z.string().url().optional(),
      start_date: z.number().optional(),
      end_date: z.number().optional(),
      // canonical: z.string().url().optional(),

      // publishDate: z.date().or(z.string()).optional(),
      draft: z.boolean().optional(),
      current: z.boolean().optional(),
      // excerpt: z.string().optional(),
      // category: z.string().optional(),
      // tags:z.array(z.string()).optional(),
      // author: z.string().optional(),
    }),
});

const books = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/books' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      // description: z.string(),
      publisher: z.string(),
      // image: z.union([z.string().url(), image()]),
      image: z.union([z.string().url(), image()]),
      store_urls: z.array(z.object({ url: z.string(), label: z.string() })).optional(),
      publish_date: z.date(),
      role: z.string(),
      publication_url: z.string().url().optional(),

      // Hero carousel properties
      herotext: z.string().optional(),
      heroimage: image().optional(),
    }),
});

const av = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/av' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // description: z.string(),
      client: z.string(),
      image: z.union([z.string().url(), image()]),
      store_urls: z.array(z.object({ url: z.string(), label: z.string() })).optional(),
      publish_date: z.date(),
      video_type: z.string(),
    }),
});

const podcasts = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/podcasts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.union([z.string().url(), image()]).optional(),
      audio_preview_url: z.string().optional(),
      player_embed: z.string().optional(),
      descript_embed: z.string().optional(),
      transcript: z.string().optional(),
      category: z.string().optional().default('Chinchilla Squeaks'),
      publication_url: z.string().url().optional(),

      // Hero carousel properties
      herotext: z.string().optional(),
      heroimage: image().optional(),
    }),
});

const newsletters = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/newsletters' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      summary: z.string().optional(),
      image: z.union([z.string().url(), image()]),
      publication_url: z.string().url().optional(),

      // Hero carousel properties
      herotext: z.string().optional(),
      heroimage: image().optional(),
    }),
});

export const collections = {
  posts: posts,
  clients: clients,
  games: games,
  events: events,
  books: books,
  av: av,
  podcasts: podcasts,
  newsletters: newsletters,
  supportLinks: supportLinks,
};
