import { test, expect } from "@playwright/test";

test.describe("Performance Optimizations", () => {
  test("should clean up will-change properties after hero animations", async ({
    page,
  }) => {
    // Navigate to home page
    await page.goto("/");

    // Locate one of the letter animations
    const firstLetter = page.locator(".letter-animate").first();

    // Verify it exists
    await expect(firstLetter).toBeVisible();

    // Wait for the cleanup timeout (2500ms in script + buffer)
    // We use a slightly longer timeout to ensure the script has run
    await page.waitForTimeout(3000);

    // Verify that the style attribute now explicitly sets will-change: auto
    // The script sets: (letter as HTMLElement).style.willChange = "auto";
    // This results in style="will-change: auto;" in the DOM
    await expect(firstLetter).toHaveAttribute("style", /will-change:\s*auto/);

    // Also verify the data-cleaned-up attribute on hero title
    const heroTitle = page.locator(".hero-title");
    await expect(heroTitle).toHaveAttribute("data-cleaned-up", "true");
  });
});
