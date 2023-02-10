import { z, defineCollection } from 'astro:content';

const posts = defineCollection({
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

const game = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});

const event = defineCollection({
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

const client = defineCollection({
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

export const collections = {
  posts: posts,
  client: client,
  game: game,
  event: event
};
