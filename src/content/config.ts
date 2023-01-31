import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    publication_url: z.string().url().optional(),

    canonical: z.string().url().optional(),

    publishDate: z.date().or(z.string()).optional(),
    draft: z.boolean().optional(),

    // excerpt: z.string().optional(),
    // category: z.string().optional(),
    // tags: z.array(z.string()).optional(),
    author: z.string().optional(),
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
  post: post,
  client: client,
};
