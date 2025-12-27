import { test, expect } from '@playwright/test';

test('Lightbox displays keyboard shortcut hints on hover', async ({ page }) => {
  // 1. Navigate to a page with a gallery (e.g., a project page)
  await page.goto('/project/corps-et-ame');

  // 2. Click the first image to open the lightbox
  const firstImage = page.locator('.gallery-image').first();
  await expect(firstImage).toBeVisible();
  await firstImage.click();

  // 3. Verify lightbox is open
  const lightbox = page.locator('#lightbox');
  await expect(lightbox).toBeVisible();

  // 4. Verify previous button hint (Arrow Left)
  const prevButton = lightbox.locator('.lightbox-prev');
  await prevButton.hover();
  const prevHint = prevButton.locator('span').filter({ hasText: '←' });
  await expect(prevHint).toBeVisible();

  // 5. Verify next button hint (Arrow Right)
  const nextButton = lightbox.locator('.lightbox-next');
  await nextButton.hover();
  const nextHint = nextButton.locator('span').filter({ hasText: '→' });
  await expect(nextHint).toBeVisible();

  // 6. Verify close button hint (Esc)
  const closeButton = lightbox.locator('.lightbox-close');
  await closeButton.hover();
  const closeHint = closeButton.locator('span').filter({ hasText: 'Esc' });
  await expect(closeHint).toBeVisible();
});
