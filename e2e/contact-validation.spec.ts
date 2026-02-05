import { test, expect } from "@playwright/test";

test.describe("Contact Form UX", () => {
  test("email field should show positive validation feedback", async ({ page }) => {
    // Navigate to the contact form (it's on the About page)
    await page.goto("/about");

    // Locate the contact form
    const contactForm = page.locator("#contact-form");
    await contactForm.scrollIntoViewIfNeeded();

    // Locate the email input
    const emailInput = contactForm.locator('input[name="email"]');

    // Locate the validation icon associated with the email input
    // It is a sibling in the same relative container
    const validationIcon = emailInput.locator('..').locator('.validation-icon');

    // Type a valid email
    await emailInput.fill("test@example.com");

    // Assert that the validation icon becomes visible (data-visible="true")
    await expect(validationIcon).toHaveAttribute("data-visible", "true");
  });
});
