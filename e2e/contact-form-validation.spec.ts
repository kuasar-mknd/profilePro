import { test, expect } from "@playwright/test";

test.describe("Contact Form Inline Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("should show error icon for invalid name and success icon for valid name", async ({
    page,
  }) => {
    const nameInput = page.locator('input[name="name"]');
    const successIcon = nameInput
      .locator("..")
      .locator(".validation-icon");
    const errorIcon = nameInput
      .locator("..")
      .locator(".error-validation-icon");

    // Type an invalid name
    await nameInput.fill("a");
    await expect(errorIcon).toHaveAttribute("data-visible", "true");
    await expect(successIcon).toHaveAttribute("data-visible", "false");

    // Type a valid name
    await nameInput.fill("John Doe");
    await expect(successIcon).toHaveAttribute("data-visible", "true");
    await expect(errorIcon).toHaveAttribute("data-visible", "false");
  });

  test("should show error icon for invalid email and success icon for valid email", async ({
    page,
  }) => {
    const emailInput = page.locator('input[name="email"]');
    const successIcon = emailInput
      .locator("..")
      .locator(".validation-icon");
    const errorIcon = emailInput
      .locator("..")
      .locator(".error-validation-icon");

    // Type an invalid email
    await emailInput.fill("invalid-email");
    await expect(errorIcon).toHaveAttribute("data-visible", "true");
    await expect(successIcon).toHaveAttribute("data-visible", "false");

    // Type a valid email
    await emailInput.fill("valid-email@example.com");
    await expect(successIcon).toHaveAttribute("data-visible", "true");
    await expect(errorIcon).toHaveAttribute("data-visible", "false");
  });

  test("should show error icon for invalid message and success icon for valid message", async ({
    page,
  }) => {
    const messageInput = page.locator('textarea[name="message"]');
    const successIcon = messageInput
      .locator("..")
      .locator(".validation-icon");
    const errorIcon = messageInput
      .locator("..")
      .locator(".error-validation-icon");

    // Type an invalid message
    await messageInput.fill("short");
    await expect(errorIcon).toHaveAttribute("data-visible", "true");
    await expect(successIcon).toHaveAttribute("data-visible", "false");

    // Type a valid message
    await messageInput.fill("This is a sufficiently long message.");
    await expect(successIcon).toHaveAttribute("data-visible", "true");
    await expect(errorIcon).toHaveAttribute("data-visible", "false");
  });
});
