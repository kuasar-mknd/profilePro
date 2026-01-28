import { test, expect } from "@playwright/test";

test.describe("Contact Form UX", () => {
  test("email field should show validation icon when valid", async ({ page }) => {
    await page.goto("/about");

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();

    // Type an invalid email first
    await emailInput.fill("invalid-email");

    // Locate the validation icon associated with the email input
    // It's a sibling in the DOM structure
    const validationIcon = page.locator('input[name="email"] ~ .validation-icon');

    // Check data-visible attribute which controls visibility in CSS
    // Using simple assertion for "false" or missing attribute
    await expect(validationIcon).not.toHaveAttribute("data-visible", "true");

    // Type a valid email
    await emailInput.fill("test@example.com");

    // Icon SHOULD be visible
    await expect(validationIcon).toHaveAttribute("data-visible", "true");
  });
});
