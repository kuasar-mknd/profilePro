import { test, expect } from "@playwright/test";

test.describe("Contact Form Rate Limiting", () => {
  test("should display error message when server returns 429", async ({ page }) => {
    await page.goto("/about");

    // Mock the /api/submit endpoint to return 429
    await page.route("**/api/submit", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Veuillez attendre quelques minutes avant de renvoyer un message.",
        }),
      });
    });

    // Fill the form
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "This is a test message that is long enough.");

    // Wait for the 2 second timestamp trap (client-side)
    // Actually we can just wait a bit or bypass it if we can control the value,
    // but waiting is easier in E2E.
    await page.waitForTimeout(2100);

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for error message
    const errorMsg = page.locator("#form-error-message");
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(/Veuillez attendre quelques minutes/);
  });
});
