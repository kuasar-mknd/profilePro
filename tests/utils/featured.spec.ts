import { describe, it, expect } from "bun:test";
import { selectFeaturedBalanced } from "../../src/utils/featured";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProject = any;

const project = (
  id: string,
  category: string,
  featured: number,
  pubDate: string,
): AnyProject => ({
  id,
  collection: "project",
  data: { title: id, category, featured, pubDate: new Date(pubDate) },
});

describe("selectFeaturedBalanced", () => {
  const fixtures: AnyProject[] = [
    // triés par date décroissante, comme getSortedProjects
    project("web-1", "web", 88, "2026-07-11"),
    project("comm-1", "communication", 95, "2025-12-05"),
    project("video-1", "video", 90, "2025-10-18"),
    project("photo-1", "photo", 68, "2025-07-18"),
    project("video-2", "video", 84, "2024-09-27"),
    project("comm-2", "communication", 50, "2024-12-01"),
    project("recent-0", "photo", 0, "2026-01-01"),
    project("old-0", "video", 0, "2022-01-01"),
  ];

  it("alterne les piliers par poids décroissant de leur meilleur projet", () => {
    const picked = selectFeaturedBalanced(fixtures, 4);
    // 1er tour : meilleur de chaque pilier, ordonnés comm(95) > video(90) > web(88) > photo(68)
    expect(picked.map((p: AnyProject) => p.id)).toEqual([
      "comm-1",
      "video-1",
      "web-1",
      "photo-1",
    ]);
  });

  it("poursuit avec le second de chaque pilier après le premier tour", () => {
    const picked = selectFeaturedBalanced(fixtures, 6);
    expect(picked.map((p: AnyProject) => p.id)).toEqual([
      "comm-1",
      "video-1",
      "web-1",
      "photo-1",
      "comm-2",
      "video-2",
    ]);
  });

  it("complète avec les projets récents quand les featured manquent", () => {
    const picked = selectFeaturedBalanced(fixtures, 8);
    expect(picked.length).toBe(8);
    // les deux non-featured arrivent en dernier, par date décroissante
    expect(picked.slice(6).map((p: AnyProject) => p.id)).toEqual([
      "recent-0",
      "old-0",
    ]);
  });

  it("respecte la limite et gère les entrées vides", () => {
    expect(selectFeaturedBalanced(fixtures, 2).length).toBe(2);
    expect(selectFeaturedBalanced([], 5)).toEqual([]);
    expect(selectFeaturedBalanced(fixtures, 0)).toEqual([]);
  });

  it("ne duplique jamais un projet", () => {
    const picked = selectFeaturedBalanced(fixtures, 20);
    const ids = picked.map((p: AnyProject) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(picked.length).toBe(fixtures.length);
  });
});
