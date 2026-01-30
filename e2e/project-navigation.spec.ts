import { test, expect } from "@playwright/test";

test.describe("Project Navigation", () => {
  test("should navigate between projects using keyboard shortcuts", async ({
    page,
  }) => {
    // Navigate to projects page first to find a link
    await page.goto("/project");

    // Click on the first project to enter detail view
    // The bento grid contains links to projects
    const firstProjectLink = page.locator(".bento-grid a").first();
    await firstProjectLink.click();

    // Verify we are on a project page
    await expect(page).toHaveURL(/\/project\//);
    const firstUrl = page.url();

    // We clicked the first project (Newest).
    // So "Next Post" (Newer) should NOT exist.
    // "Previous Post" (Older) should exist (assuming >1 project).

    const navOlder = page.locator("#nav-older");

    // Check if we have an older project to navigate to
    if ((await navOlder.count()) > 0) {
      // Press Right Arrow (or J) to go to Older project
      await page.keyboard.press("ArrowRight");

      // Verify URL changed
      await expect(page).not.toHaveURL(firstUrl);
      const secondUrl = page.url();

      // Now go back (Newer / Left Arrow / K)
      await page.keyboard.press("k"); // Testing 'k' shortcut here

      // Verify we are back
      await expect(page).toHaveURL(firstUrl);
    }
  });

  test("should display keyboard hints on desktop", async ({ page }) => {
    await page.goto("/project");
    await page.locator(".bento-grid a").first().click();

    // Set viewport to desktop size to ensure hints are visible
    await page.setViewportSize({ width: 1280, height: 720 });

    const hint = page.locator("text=Naviguer");
    await expect(hint).toBeVisible();
    await expect(page.locator("kbd").filter({ hasText: "←" })).toBeVisible();
    await expect(page.locator("kbd").filter({ hasText: "→" })).toBeVisible();
  });
});
