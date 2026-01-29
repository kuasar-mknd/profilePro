import { test, expect } from '@playwright/test';

test.describe('Project Keyboard Navigation', () => {
  test('should navigate between projects using arrow keys', async ({ page }) => {
    // Navigate to a project page that is likely to have both newer and older projects
    // "48h-geneve-2024" seems like a good candidate based on the file list (middle of the pack?)
    await page.goto('/project/48h-geneve-2024');

    // Wait for hydration/script execution
    await page.waitForLoadState('networkidle');

    // Check if we have navigation links
    const newerLink = page.locator('#nav-newer');
    const olderLink = page.locator('#nav-older');

    const hasNewer = await newerLink.count() > 0;
    const hasOlder = await olderLink.count() > 0;

    console.log(`Has newer link: ${hasNewer}`);
    console.log(`Has older link: ${hasOlder}`);

    // Verify attributes
    if (hasNewer) {
      await expect(newerLink).toHaveAttribute('aria-keyshortcuts', 'ArrowLeft');
      await expect(newerLink).toHaveAttribute('title', /←/);
    }

    if (hasOlder) {
      await expect(olderLink).toHaveAttribute('aria-keyshortcuts', 'ArrowRight');
      await expect(olderLink).toHaveAttribute('title', /→/);
    }

    // Test ArrowRight (Older/Next in visual order)
    if (hasOlder) {
      const olderHref = await olderLink.getAttribute('href');
      console.log(`Navigating to older: ${olderHref}`);

      await page.keyboard.press('ArrowRight');
      await expect(page).toHaveURL(new RegExp(olderHref!));

      // Go back to reset
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }

    // Test ArrowLeft (Newer/Previous in visual order)
    if (hasNewer) {
      const newerHref = await newerLink.getAttribute('href');
      console.log(`Navigating to newer: ${newerHref}`);

      await page.keyboard.press('ArrowLeft');
      await expect(page).toHaveURL(new RegExp(newerHref!));
    }
  });

  test('should not navigate if lightbox is open', async ({ page }) => {
     await page.goto('/project/48h-geneve-2024');
     await page.waitForLoadState('networkidle');

     const olderLink = page.locator('#nav-older');
     if (await olderLink.count() === 0) test.skip();

     // Mock the lightbox open state by manually setting aria-hidden="false" on #lightbox
     // We can't easily click an image without knowing which one, but we can force the state
     await page.evaluate(() => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.setAttribute('aria-hidden', 'false');
        }
     });

     const currentUrl = page.url();
     await page.keyboard.press('ArrowRight');

     // Should stay on same page
     expect(page.url()).toBe(currentUrl);
  });
});
