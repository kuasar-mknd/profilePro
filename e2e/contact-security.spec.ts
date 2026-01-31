import { test, expect } from "@playwright/test";

test.describe("Contact Form Security", () => {
  test.beforeEach(async ({ page }) => {
    // Mock Web3Forms API
    await page.route("https://api.web3forms.com/submit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "Form submitted successfully" }),
      });
    });

    await page.goto("/");
    // Wait for form to be ready
    await page.waitForSelector("#contact-form");
  });

  test("should block non-numeric timestamp bypass", async ({ page }) => {
    // Fill the form with valid data
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a legitimate test message.");

    // Manipulate the timestamp to be non-numeric (NaN bypass attempt)
    await page.evaluate(() => {
      const input = document.getElementById("form-load-timestamp") as HTMLInputElement;
      if (input) input.value = "invalid-timestamp";
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect the error message to be displayed
    // The message for timestamp failure is "Le formulaire a été soumis trop rapidement. Veuillez réessayer."
    const errorMessage = page.locator("#form-error-message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Le formulaire a été soumis trop rapidement");

    // Take screenshot for verification
    await page.screenshot({ path: "e2e/screenshots/contact-security-error.png" });

    // Verify request was NOT sent (optional, but good for confirmation)
    // We can't easily assert "no request" without a timeout, so UI check is sufficient.
  });

  test("should block spammy content (excessive URLs)", async ({ page }) => {
    // Fill the form with spammy content (many URLs)
    const spamMessage = "Check this out: http://spam.com http://phishing.site http://malware.org http://scam.net";

    await page.fill('input[name="name"]', "Spammer");
    await page.fill('input[name="email"]', "spammer@example.com");
    await page.fill('textarea[name="message"]', spamMessage);

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect the specific error message for excessive URLs
    const errorMessage = page.locator("#form-error-message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Votre message contient trop de liens");
  });

  test("should block blocked keywords", async ({ page }) => {
    // Fill the form with blocked keyword
    const spamMessage = "I want to talk about crypto investment opportunities.";

    await page.fill('input[name="name"]', "Spammer");
    await page.fill('input[name="email"]', "spammer@example.com");
    await page.fill('textarea[name="message"]', spamMessage);

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect the specific error message for blocked keywords
    const errorMessage = page.locator("#form-error-message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Votre message contient des termes bloqués");
  });
});
