import type { CollectionEntry } from "astro:content";

type Project = CollectionEntry<"project">;
type Category = Project["data"]["category"];

/**
 * Les trois piliers éditoriaux du site. Chaque pilier regroupe une ou
 * plusieurs catégories de projets (la création de contenu réunit vidéo
 * et photo). Les classes Tailwind sont écrites en toutes lettres pour
 * rester détectables par le JIT.
 */
export interface Pillar {
  slug: string;
  label: string;
  categories: Category[];
  description: string;
}

export const PILLARS: Pillar[] = [
  {
    slug: "creation-de-contenu",
    label: "Création de contenu",
    categories: ["video", "photo"],
    description:
      "Vidéo et photographie : tournages, reportages et créations visuelles.",
  },
  {
    slug: "developpement-web",
    label: "Développement web",
    categories: ["web"],
    description:
      "Sites, applications et plateformes — conçus, développés et exploités.",
  },
  {
    slug: "communication",
    label: "Communication",
    categories: ["communication"],
    description: "Stratégies, campagnes et promotion d'événements.",
  },
];

/** Libellé et couleurs par catégorie (badges de cartes, chips). */
export const CATEGORY_META: Record<
  Category,
  { label: string; badgeClass: string; textClass: string }
> = {
  video: {
    label: "Vidéo",
    badgeClass: "bg-purple-600/80 border-purple-300/40",
    textClass: "text-purple-500",
  },
  photo: {
    label: "Photo",
    badgeClass: "bg-pink-600/80 border-pink-300/40",
    textClass: "text-pink-500",
  },
  web: {
    label: "Web",
    badgeClass: "bg-blue-600/80 border-blue-300/40",
    textClass: "text-blue-500",
  },
  communication: {
    label: "Communication",
    badgeClass: "bg-orange-600/80 border-orange-300/40",
    textClass: "text-orange-500",
  },
};

export function pillarOfCategory(category: Category): Pillar {
  return (
    PILLARS.find((pillar) => pillar.categories.includes(category)) ?? PILLARS[0]
  );
}

export function projectsOfPillar(
  projects: Project[],
  pillar: Pillar,
): Project[] {
  return projects.filter((project) =>
    pillar.categories.includes(project.data.category),
  );
}

/** Nombre de projets par pilier, pour les compteurs de filtres. */
export function pillarCounts(projects: Project[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const pillar of PILLARS) {
    counts[pillar.slug] = 0;
  }
  for (const project of projects) {
    counts[pillarOfCategory(project.data.category).slug]++;
  }
  return counts;
}
