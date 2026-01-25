import { test, expect } from "@playwright/test";

test.describe("Keyboard Shortcuts", () => {
  test("Shift+D should toggle dark mode", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await page.waitForLoadState('domcontentloaded');

    const toggle = page.locator(".theme-toggle-btn").first();
    // Verify accessibility labels
    await expect(toggle).toHaveAttribute("title", /Maj\+D/);
    await expect(toggle).toHaveAttribute("aria-label", /Maj\+D/);
    await expect(toggle).toHaveAttribute("aria-keyshortcuts", "Shift+D");

    const isDarkInitial = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Press Shift+D
    await page.keyboard.press("Shift+D");

    // Check if class toggled
    if (isDarkInitial) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    // Toggle back
    await page.keyboard.press("Shift+D");
    if (isDarkInitial) {
        await expect(html).toHaveClass(/dark/);
    } else {
        await expect(html).not.toHaveClass(/dark/);
    }
  });

  test("Shift+D should NOT toggle dark mode when typing in input", async ({ page }) => {
    await page.goto("/");

    const input = page.locator("#name");
    await input.scrollIntoViewIfNeeded();
    await input.click();

    const html = page.locator("html");
    const isDarkInitial = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Type Shift+D (should be input text)
    await page.keyboard.press("Shift+D");

    // Should NOT have changed
    if (isDarkInitial) {
       await expect(html).toHaveClass(/dark/);
    } else {
       await expect(html).not.toHaveClass(/dark/);
    }

    await expect(input).toHaveValue("D");
  });

  test("Shift+D should work correctly after navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState('domcontentloaded');

    // Navigate to /about (using the link in header)
    // There are multiple "À propos" links (header, footer). First one is usually header.
    // Navigation.astro links are in header.
    await page.getByRole("link", { name: "À propos" }).first().click();
    await page.waitForURL(/\/about/);
    await page.waitForLoadState('domcontentloaded');

    const html = page.locator("html");
    const isDarkInitial = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Press Shift+D
    await page.keyboard.press("Shift+D");
    // Wait a bit to ensure potential double-toggle happened
    await page.waitForTimeout(500);

    // Check if class toggled once
    if (isDarkInitial) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });
});
