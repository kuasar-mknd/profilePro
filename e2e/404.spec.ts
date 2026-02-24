import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test("should display 404 page for non-existent routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-at-all");

    // Using first() to avoid strict mode violation if other h1s exist (e.g. debug tools)
    await expect(page.locator("h1").first()).toContainText(/Oups/i);
    await expect(page.locator("text=404")).toBeVisible();
  });

  test("should have a home button that points to root", async ({ page }) => {
    await page.goto("/404");

    // Be specific to avoid multiple matches (Header, Main, Footer)
    const homeBtn = page.locator("main").getByRole("link", { name: /Retour à l'accueil/i }).first();
    await expect(homeBtn).toBeVisible();
    await expect(homeBtn).toHaveAttribute("href", "/");
  });

  test("should show back button when there is navigation history", async ({ page }) => {
    // Navigate to home first
    await page.goto("/");
    // Then navigate to a non-existent page to trigger 404
    await page.goto("/missing-page");

    const backBtn = page.locator("#go-back-btn");
    await expect(backBtn).toBeVisible();
    await expect(backBtn).not.toHaveClass(/hidden/);
  });
});
