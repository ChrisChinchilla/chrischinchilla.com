import { z, defineCollection } from 'astro:content';

const posts = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    // description: z.string().optional(),
    image: z.string().optional(),
    publication_url: z.string().url().optional(),

    // canonical: z.string().url().optional(),

    publishDate: z.date().or(z.string()).optional(),
    // draft: z.boolean().optional(),

    // excerpt: z.string().optional(),
    // category: z.string().optional(),
    // tags: z.array(z.string()).optional(),
    // author: z.string().optional(),
  }),
});

const games = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    image: z.string(),
    publisher: z.string().optional(),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date().optional(),
    role: z.string(),
  }),
});

const events = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
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
  type: 'content', // v2.5.0 and later
  schema: z.object({
    type: z.string(),
    title: z.string(),

    description: z.string().optional(),
    image: z.string().optional(),
    company_url: z.string().url().optional(),

    // canonical: z.string().url().optional(),

    // publishDate: z.date().or(z.string()).optional(),
    draft: z.boolean().optional(),

    // excerpt: z.string().optional(),
    // category: z.string().optional(),
    // tags: z.array(z.string()).optional(),
    // author: z.string().optional(),
  }),
});

const books = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    // description: z.string(),
    publisher: z.string(),
    image: z.string(),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date(),
    role: z.string(),
  }),
});

const av = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    // description: z.string(),
    client: z.string(),
    image: z.string(),
    store_urls: z.array(z.object({url: z.string(), label: z.string()})).optional(),
    publish_date: z.date(),
    video_type: z.string(),
  }),
});

// const podcasts = defineCollection({
//   type: 'content', // v2.5.0 and later
//   schema: z.object({
//     title: z.string(),
//     description: z.string(),
//     image: z.string(),
//     audio_preview_url: z.string(),
//   }),
// });

export const collections = {
  posts: posts,
  clients: clients,
  games: games,
  events: events,
  books: books,
  av: av,
  // podcasts: podcasts,
};
