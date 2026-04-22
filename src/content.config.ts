import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/author" }),
  schema: ({ image }) =>
    z.object({
      displayName: z.string().min(1).max(50),
      bio: z.string().max(500).optional(),
      photo: image().optional(),
    }),
});

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/project" }),
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
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/cvExperience",
  }),
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
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/cvEducation" }),
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
