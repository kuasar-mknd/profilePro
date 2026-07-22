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

// Piliers éditoriaux du portfolio : pilotent les filtres, l'équilibre de la
// home et (à terme) les pages services. Complémentaire de `type` qui ne
// détermine que le média affiché (player vidéo vs galerie).
export const PROJECT_CATEGORIES = [
  "video",
  "photo",
  "web",
  "communication",
] as const;

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

      // Taxonomie éditoriale
      category: z.enum(PROJECT_CATEGORIES), // pilier principal (cover, OG, tri home)
      secondaryCategories: z.array(z.enum(PROJECT_CATEGORIES)).default([]), // projets transverses présents dans plusieurs piliers
      role: z.string().min(1).max(100),
      client: z.string().max(100).optional(),
      featured: z.number().int().min(0).max(100).default(0), // poids éditorial, 0 = non mis en avant
      awards: z.array(z.string().max(120)).default([]),
      metrics: z
        .array(
          z.object({ label: z.string().max(60), value: z.string().max(40) }),
        )
        .default([]),
      skills: z.array(z.string().max(40)).default([]),
      liveUrl: z.string().url().optional(), // projets web : démo/production
      repoUrl: z.string().url().optional(), // projets web : code source
      figmaUrl: z.string().url().optional(), // projets design : maquettes / espace Figma

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
