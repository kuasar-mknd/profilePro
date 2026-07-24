import { test, expect } from "@playwright/test";

test.describe("Samuel Dulex Portfolio - E2E Tests", () => {
  test("home page should load and display key elements", async ({ page }) => {
    await page.goto("/");

    // Verify title
    await expect(page).toHaveTitle(/Samuel Dulex/);

    // Verify Hero title parts (Specific to main content h1)
    const mainH1 = page.locator("main h1").first();
    await expect(mainH1).toContainText(/Création de contenu/i);
    await expect(mainH1).toContainText(/Développement web/i);
    await expect(mainH1).toContainText(/Communication/i);

    // Verify Navigation exists (use first() for dual nav)
    await expect(page.locator("header#main-header")).toBeVisible();
    await expect(page.locator("header nav").first()).toBeVisible();
  });

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/");

    const aboutLink = page
      .locator("header nav")
      .first()
      .getByRole("link", { name: /À propos/i });
    await aboutLink.click();

    await expect(page).toHaveURL(/\/about/);
    // h1 contains the title, "Samuel" is in a greeting div
    await expect(page.locator("main h1").first()).toContainText(/Créateur/i);
    await expect(page.locator("main")).toContainText(/Samuel/i);
  });

  test("should navigate to projects page", async ({ page }) => {
    await page.goto("/");

    const projectsLink = page
      .locator("header nav")
      .first()
      .getByRole("link", { name: /Projets/i });
    await projectsLink.click();

    await expect(page).toHaveURL(/\/project/);
    // Navigation link for Projets should be active
    await expect(projectsLink).toHaveAttribute("aria-current", "page");
  });

  test("contact form should show validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/about/");

    const contactForm = page.locator("#contact-form");
    await contactForm.scrollIntoViewIfNeeded();

    const submitBtn = contactForm.locator('button[type="submit"]');
    await submitBtn.click();

    const errorMsg = page.locator("#form-error-message");
    await expect(errorMsg).toBeVisible();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  });

  test("contact form requires consent before submitting", async ({ page }) => {
    await page.goto("/about/");

    const contactForm = page.locator("#contact-form");
    await contactForm.scrollIntoViewIfNeeded();

    // Fill all fields but leave the consent checkbox unchecked.
    await page.locator("#name").fill("Jean Test");
    await page.locator("#email").fill("jean@example.com");
    await page
      .locator("#message")
      .fill("Bonjour, ceci est un message de test suffisamment long.");

    await contactForm.locator('button[type="submit"]').click();

    // Submission is blocked and the consent field is flagged invalid.
    await expect(page.locator("#form-error-message")).toBeVisible();
    await expect(page.locator("#consent")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    // Checking the box clears the invalid state.
    await page.locator("#consent").check();
    await expect(page.locator("#consent")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/politique-de-confidentialite/");
    await expect(page.locator("main h1").first()).toContainText(
      /Politique de confidentialité/i,
    );
    // The contact form links to this page.
    await page.goto("/about/");
    await expect(
      page
        .locator("#contact-form")
        .getByRole("link", { name: /politique de confidentialité/i }),
    ).toHaveAttribute("href", "/politique-de-confidentialite/");
  });

  test("theme toggle should work", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.locator(".theme-toggle-btn").first();
    await expect(themeToggle).toBeVisible();

    const html = page.locator("html");
    const isDarkInitial = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    await themeToggle.click();

    if (isDarkInitial) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });

  test("textarea should auto-resize", async ({ page }) => {
    await page.goto("/about/");
    const textarea = page.locator("#message");
    await textarea.scrollIntoViewIfNeeded();

    const initialHeight = await textarea.evaluate(
      (el) => (el as HTMLElement).clientHeight,
    );

    // Fill with text containing many newlines to force resize
    const longText =
      "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12";
    await textarea.fill(longText);

    // Wait a brief moment for the requestAnimationFrame to trigger the resize
    await page.waitForTimeout(100);

    const newHeight = await textarea.evaluate(
      (el) => (el as HTMLElement).clientHeight,
    );

    expect(newHeight).toBeGreaterThan(initialHeight);
  });
});
