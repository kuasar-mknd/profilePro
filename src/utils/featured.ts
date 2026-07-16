import type { CollectionEntry } from "astro:content";

type Project = CollectionEntry<"project">;

/**
 * Sélection éditoriale de la home : retient les projets mis en avant
 * (`featured` > 0) en alternant les piliers (`category`) pour qu'aucun
 * ne domine — le tri par date brute favorisait mécaniquement la vidéo.
 *
 * Les piliers sont visités par poids décroissant de leur meilleur projet,
 * un projet par pilier et par tour. Si la sélection est plus courte que
 * `limit`, elle est complétée par les projets restants les plus récents
 * (l'entrée est supposée triée par date décroissante, cf. getSortedProjects).
 */
export function selectFeaturedBalanced(
  projects: Project[],
  limit: number,
): Project[] {
  if (limit <= 0) return [];

  const byCategory = new Map<string, Project[]>();
  for (const project of projects) {
    if ((project.data.featured ?? 0) > 0) {
      const list = byCategory.get(project.data.category) ?? [];
      list.push(project);
      byCategory.set(project.data.category, list);
    }
  }

  for (const list of byCategory.values()) {
    list.sort(
      (a, b) =>
        b.data.featured - a.data.featured ||
        b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
  }

  const categories = [...byCategory.entries()]
    .sort(([, a], [, b]) => b[0].data.featured - a[0].data.featured)
    .map(([category]) => category);

  const picked: Project[] = [];
  for (let rank = 0; picked.length < limit; rank++) {
    let added = false;
    for (const category of categories) {
      const list = byCategory.get(category);
      if (list && rank < list.length) {
        picked.push(list[rank]);
        added = true;
        if (picked.length >= limit) break;
      }
    }
    if (!added) break; // plus aucun projet featured disponible
  }

  if (picked.length < limit) {
    const chosen = new Set(picked.map((project) => project.id));
    for (const project of projects) {
      if (!chosen.has(project.id)) {
        picked.push(project);
        if (picked.length >= limit) break;
      }
    }
  }

  return picked;
}
