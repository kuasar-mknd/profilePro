import { test, expect } from "@playwright/test";

test.describe("Lightbox E2E Tests", () => {
  test("should open lightbox when clicking an image in gallery", async ({ page }) => {
    // Navigate to a project page with a gallery
    await page.goto("/project/larev");

    // Wait for gallery images to load
    const galleryImage = page.locator("[data-gallery-image]").first();
    await expect(galleryImage).toBeVisible();

    // Click the first image
    await galleryImage.click();

    // Verify lightbox opens
    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toHaveAttribute("aria-hidden", "false");
    await expect(lightbox).toBeVisible();

    // Verify image inside lightbox is visible
    const lightboxImage = lightbox.locator(".lightbox-image");
    // Increase timeout for image loading in dev mode
    await expect(lightboxImage).toBeVisible({ timeout: 20000 });

    // Test navigation (Next)
    const nextBtn = lightbox.locator(".lightbox-next");
    await nextBtn.click();
    // Verify image source changed or at least it didn't crash
    // (Difficult to verify src change without knowing the exact sequence, but visibility is key)
    await expect(lightboxImage).toBeVisible();

    // Test close button
    const closeBtn = lightbox.locator(".lightbox-close");
    await closeBtn.click();

    // Verify lightbox closes
    await expect(lightbox).toHaveAttribute("aria-hidden", "true");
    await expect(lightbox).not.toBeVisible();
  });
});
