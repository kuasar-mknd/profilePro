import { defineCollection, reference, z } from "astro:content";

const authorCollection = defineCollection({
  type: "data", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      displayName: z.string().min(1).max(50),
      bio: z.string().max(500).optional(),
      photo: image().optional(),
    }),
});

const projectCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(100),
      intro: z.string().min(1).max(300),
      tag: z.string().min(1).max(30),
      image: image().optional(),
      author: reference("author"),
      pubDate: z.date(),
      type: z.enum(["video", "photo", "general"]).optional().default("general"),
      videoUrl: z.string().url().optional(), // For video projects (YouTube/Vimeo ID or URL)
      gallery: z.array(image()).optional(), // For photo projects

      // SEO Fields
      seoTitle: z.string().max(70).optional(), // Google truncation limit approx 60-70 chars
      seoDescription: z.string().max(160).optional(), // Google truncation limit approx 160 chars
      ogImage: image().optional(),
    }),
});

const cvExperienceCollection = defineCollection({
  type: "content",
  schema: z.object({
    role: z.string().min(1).max(100),
    company: z.string().min(1).max(100),
    period: z.string().min(1).max(50),
    lang: z.enum(["fr", "en"]).default("fr"),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const cvEducationCollection = defineCollection({
  type: "content",
  schema: z.object({
    degree: z.string().min(1).max(100),
    school: z.string().min(1).max(150),
    period: z.string().min(1).max(50),
    lang: z.enum(["fr", "en"]).default("fr"),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  author: authorCollection,
  project: projectCollection,
  cvExperience: cvExperienceCollection,
  cvEducation: cvEducationCollection,
};
