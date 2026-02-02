import { test, expect } from "@playwright/test";

test.describe("Samuel Dulex Portfolio - E2E Tests", () => {
  test("home page should load and display key elements", async ({ page }) => {
    await page.goto("/");

    // Verify title
    await expect(page).toHaveTitle(/Samuel Dulex/);

    // Verify Hero title parts (Specific to main content h1)
    const mainH1 = page.locator("main h1").first();
    await expect(mainH1).toContainText(/Connecter/i);
    await expect(mainH1).toContainText(/Captiver/i);

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
    await page.goto("/about");

    const contactForm = page.locator("#contact-form");
    await contactForm.scrollIntoViewIfNeeded();

    const submitBtn = contactForm.locator('button[type="submit"]');
    await submitBtn.click();

    const errorMsg = page.locator("#form-error-message");
    await expect(errorMsg).toBeVisible();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
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

  test("contact form should show validation success icon for valid email", async ({
    page,
  }) => {
    await page.goto("/about");

    const contactForm = page.locator("#contact-form");
    await contactForm.scrollIntoViewIfNeeded();

    const emailInput = contactForm.locator('input[name="email"]');
    // The validation icon is a sibling to the input
    const validationIcon = contactForm.locator(
      'input[name="email"] ~ .validation-icon',
    );

    // Initial state: hidden (data-visible="false" or missing, let's check attribute presence logic)
    // The HTML has data-[visible=true] styling but JS toggles data-visible attribute
    // In JS: iconWrapper.dataset.visible = isValid ? "true" : "false";
    // Initially it might not be set or set to false depending on how it's rendered.
    // Let's assume checking for "true" is the key.

    // Type invalid email
    await emailInput.fill("invalid-email");
    await expect(validationIcon).toHaveAttribute("data-visible", "false");

    // Type valid email
    await emailInput.fill("test@example.com");
    await expect(validationIcon).toHaveAttribute("data-visible", "true");
  });
});
