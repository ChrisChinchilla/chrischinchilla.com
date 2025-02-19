import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// TODO: This used to be possible
// import defaultBlogImage from '~/src/assets/images/defaults/blog-chinchilla.jpg'

const posts = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/posts" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // description: z.string().optional(),
    // TODO: This used to be possible
    // image: image().optional().default(defaultBlogImage),
    image: image().optional(),
    publication_url: z.string().url().optional(),

    // canonical: z.string().url().optional(),

    publishDate: z.date().or(z.string()).optional(),
    // draft: z.boolean().optional(),

    // excerpt: z.string().optional(),
    // category: z.string().optional(),
    tags:z.array(z.string()).optional(),
    // author: z.string().optional(),
  }),
});

const games = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/games" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: z.union([z.string().url(), image()]),
    publisher: z.string().optional(),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date().optional(),
    role: z.string(),
  }),
});

const events = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/events" }),
  schema: ({ image }) => z.object({
    title: z.string().optional(),
    action: z.string().optional(),
    event: z.string(),
    start_date: z.date(),
    end_date: z.date().optional(),
    venue: z.string().optional(),
    pres_source: z.string().optional(),
    pres_url: z.string().optional(),
  }),
});

const clients = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/clients" }),
  schema: ({ image }) => z.object({
    type: z.string(),
    title: z.string(),

    description: z.string().optional(),
    image: z.union([z.string().url(), image()]),
    company_url: z.string().url().optional(),

    // canonical: z.string().url().optional(),

    // publishDate: z.date().or(z.string()).optional(),
    draft: z.boolean().optional(),

    // excerpt: z.string().optional(),
    // category: z.string().optional(),
    // tags:z.array(z.string()).optional(),
    // author: z.string().optional(),
  }),
});

const books = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/books" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // description: z.string(),
    publisher: z.string(),
    // image: z.union([z.string().url(), image()]),
    image: z.union([z.string().url(), image()]),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date(),
    role: z.string(),
  }),
});

const av = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/av" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // description: z.string(),
    client: z.string(),
    image: z.union([z.string().url(), image()]),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date(),
    video_type: z.string(),
  }),
});

const podcasts = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/podcasts" }),
  schema: z.object({
    title: z.string().optional( ),
    description: z.string().optional(),
    image: z.string().optional(),
    audio_preview_url: z.string().optional(),
    player_embed: z.string().optional(),
    descript_embed: z.string().optional(),
    transcript: z.string().optional(),
    category: z.string().optional().default('Chinchilla Squeaks')
  }),
});

const newsletters = defineCollection({
  // type: 'content', // v2.5.0 and later
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/newsletters" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    image: z.union([z.string().url(), image()]),
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
};
