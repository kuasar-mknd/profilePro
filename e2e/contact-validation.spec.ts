import { test, expect } from "@playwright/test";

test.describe("Contact Form Validation", () => {
  test("email field should show success icon when valid", async ({ page }) => {
    // Navigate to /about where the contact form is located
    await page.goto("/about");

    // Wait for form to be visible
    const emailInput = page.locator('input[name="email"]');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();

    // The validation icon is a sibling of the input.
    // Structure: input + div.input-glow + div.validation-icon
    const validationIcon = page.locator('input[name="email"] ~ .validation-icon');

    // Initial state: not visible (data-visible undefined or false)
    await expect(validationIcon).not.toHaveAttribute("data-visible", "true");

    // Type invalid email
    await emailInput.fill("invalid-email");
    // Should still be invisible/false
    await expect(validationIcon).not.toHaveAttribute("data-visible", "true");

    // Type valid email
    await emailInput.fill("test@example.com");
    // Should become visible/true
    await expect(validationIcon).toHaveAttribute("data-visible", "true");

    // Make it invalid again
    await emailInput.fill("invalid");
    // Should become invisible/false
    await expect(validationIcon).toHaveAttribute("data-visible", "false");
  });
});
