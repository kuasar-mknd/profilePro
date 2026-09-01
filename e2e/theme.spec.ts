import { test, expect } from "@playwright/test";

/**
 * Garde-fou de régression : la page /portfolio-pdf/ (source de l'export PDF)
 * redéfinit `body`, `*` et `@page` hors de toute couche Tailwind. Déclarée en
 * `is:global`, elle écrasait les utilitaires de TOUTES les pages du site :
 * fond clair figé, texte du hero blanc sur blanc en mode sombre.
 * Ces tests vérifient que son CSS reste confiné à sa page et que le thème
 * sombre reste cohérent (fond sombre ET texte clair).
 */

const PAGES_PUBLIQUES = ["/", "/about/", "/cv/", "/project/"];

/** Convertit une couleur calculée `rgb(r, g, b)` en luminance perçue 0-255. */
function luminance(couleur: string): number {
  const [r, g, b] = (couleur.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).map(
    Number,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test.describe("Isolation du CSS de la page d'export PDF", () => {
  for (const chemin of PAGES_PUBLIQUES) {
    test(`${chemin} n'embarque pas le CSS de /portfolio-pdf/`, async ({
      page,
    }) => {
      await page.goto(chemin);

      const css = await page.evaluate(() =>
        Array.from(document.querySelectorAll("style"))
          .map((s) => s.textContent ?? "")
          .join("\n"),
      );

      // Marqueurs propres à la mise en page A4 de l'export PDF.
      for (const marqueur of [
        "A4 landscape",
        "297mm",
        "qr-caption",
        "#e2e8f0",
      ]) {
        expect(
          css,
          `le CSS de /portfolio-pdf/ (« ${marqueur} ») ne doit pas fuir sur ${chemin}`,
        ).not.toContain(marqueur);
      }
    });
  }

  test("la page /portfolio-pdf/ garde bien sa propre mise en page A4", async ({
    page,
  }) => {
    await page.goto("/portfolio-pdf/");
    const largeur = await page.evaluate(() => {
      const feuille = document.querySelector(".sheet");
      return feuille ? getComputedStyle(feuille).width : null;
    });
    // 297mm ≈ 1122px : la feuille A4 paysage doit rester dimensionnée.
    expect(largeur).not.toBeNull();
    expect(parseFloat(largeur!)).toBeGreaterThan(1000);
  });
});

test.describe("Cohérence du thème", () => {
  test("le mode sombre garde un fond sombre et un texte clair", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");

    const { fond, titre } = await page.evaluate(() => {
      const h1 = document.querySelector("main h1");
      return {
        fond: getComputedStyle(document.body).backgroundColor,
        titre: h1 ? getComputedStyle(h1).color : "",
      };
    });

    expect(
      luminance(fond),
      `le fond doit rester sombre en thème sombre (obtenu : ${fond})`,
    ).toBeLessThan(80);
    expect(
      luminance(titre),
      `le titre doit rester clair en thème sombre (obtenu : ${titre})`,
    ).toBeGreaterThan(150);

    await context.close();
  });

  test("le mode clair garde un fond clair et un texte sombre", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");

    const { fond, titre } = await page.evaluate(() => {
      const h1 = document.querySelector("main h1");
      return {
        fond: getComputedStyle(document.body).backgroundColor,
        titre: h1 ? getComputedStyle(h1).color : "",
      };
    });

    expect(
      luminance(fond),
      `le fond doit rester clair en thème clair (obtenu : ${fond})`,
    ).toBeGreaterThan(200);
    expect(
      luminance(titre),
      `le titre doit rester sombre en thème clair (obtenu : ${titre})`,
    ).toBeLessThan(100);

    await context.close();
  });
});

test.describe("Retrait de la PWA", () => {
  test("aucun service worker n'est enregistré et les anciens sont purgés", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    const nbServiceWorkers = await page.evaluate(async () =>
      "serviceWorker" in navigator
        ? (await navigator.serviceWorker.getRegistrations()).length
        : 0,
    );
    expect(nbServiceWorkers).toBe(0);

    // Plus de lien manifest : le site n'est plus installable en PWA.
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(0);
  });
});
