import { defineCollection, reference, z } from 'astro:content';

const pageCollection = defineCollection({
    type: 'content', // v2.5.0 and later
    schema: ({image}) => z.object({
        title: z.string(),
        intro: z.string(),
        image: image().optional(),
        type: z.string().optional(),
    }),
});

const authorCollection = defineCollection({
    type: 'data', // v2.5.0 and later
    schema: ({image}) => z.object({
        displayName: z.string(),
        bio: z.string().optional(),
        photo: image().optional()
    }),
});

const projectCollection = defineCollection({
    type: 'content', // v2.5.0 and later
    schema: ({image}) => z.object({
        title: z.string(),
        intro: z.string(),
        tag: z.string(),
        image: image().optional(),
        author: reference('author'),
        pubDate: z.date(),
        type: z.string().optional(),
    }),
});

export const collections = {
    'author': authorCollection,
    'page': pageCollection,
    'project': projectCollection
};