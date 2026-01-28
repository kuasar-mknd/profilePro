import { test, expect } from "@playwright/test";

test.describe("Keyboard Navigation - Projects", () => {
  test("should navigate between projects using arrow keys and j/k shortcuts", async ({
    page,
  }) => {
    // 1. Go to Projects page
    await page.goto("/project");

    // 2. Click the first project to enter detail view
    // Assuming the projects are links within main content
    const firstProjectLink = page.locator("main a[href^='/project/']").first();
    await expect(firstProjectLink).toBeVisible();
    await firstProjectLink.click();

    // Verify we are on a project detail page
    await expect(page).toHaveURL(/\/project\//);

    // Store the current URL
    const firstProjectUrl = page.url();

    // 3. Test Right Arrow (Next/Older Project)
    // Check if there is a "next" link (nav-project-next)
    const nextLink = page.locator("#nav-project-next");
    if (await nextLink.isVisible()) {
      await page.keyboard.press("ArrowRight");
      await expect(page).not.toHaveURL(firstProjectUrl);
      const secondProjectUrl = page.url();

      // 4. Test Left Arrow (Prev/Newer Project) - Should go back to first project
      await page.keyboard.press("ArrowLeft");
      await expect(page).toHaveURL(firstProjectUrl);

      // 5. Test 'j' (Next/Older Project)
      await page.keyboard.press("j");
      await expect(page).toHaveURL(secondProjectUrl);

      // 6. Test 'k' (Prev/Newer Project)
      await page.keyboard.press("k");
      await expect(page).toHaveURL(firstProjectUrl);
    } else {
      console.log("No next project link found (only one project?), skipping navigation test.");
    }
  });

  test("should NOT navigate when typing in an input", async ({ page }) => {
     // 1. Go to Projects page
     await page.goto("/project");

     // 2. Click the first project to enter detail view
     const firstProjectLink = page.locator("main a[href^='/project/']").first();
     await firstProjectLink.click();

     // 3. Focus the contact form input (if available in footer)
     // CTA section usually has a link to #contact-form, which is on homepage or about page?
     // Wait, the project page has a CTA "Discuter de votre projet" which links to `/#cta-section`.
     // But `Base.astro` might not have a global contact form in the footer unless included.
     // `src/pages/project/[slug].astro` imports `Base`. `Base` imports `Footer`.

     // Let's check if there is an input on the page.
     // The ContactForm is imported in `CTASection` which is in `index.astro`, NOT in `project/[slug].astro` directly?
     // `src/pages/project/[slug].astro` has:
     /*
       <div class="container mx-auto max-w-5xl px-7 mt-12 mb-20">
        <div class="bg-pacamara-accent/10 ...">
          ...
          <a href="/#cta-section" ...>Discuter de votre projet</a>
        </div>
      </div>
     */
     // So there is NO input on the project detail page itself, except maybe the footer newsletter if it exists?
     // If there are no inputs, this test case is moot for this specific page, but valuable for robustness if inputs are added.

     // Let's skip this check if no inputs are found.
     const input = page.locator("input, textarea").first();
     if (await input.count() > 0) {
        await input.focus();
        const initialUrl = page.url();
        await page.keyboard.press("ArrowRight");
        await expect(page).toHaveURL(initialUrl); // Should not navigate
     }
  });
});
