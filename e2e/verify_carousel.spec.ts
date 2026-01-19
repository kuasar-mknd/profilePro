
import { test, expect } from '@playwright/test';

test('Hero carousel has correct classes and attributes', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:4321/');

  // Wait for the carousel track to be visible
  const carouselTrack = page.locator('#carousel-track');
  await expect(carouselTrack).toBeVisible();

  // Check if it has the infinite-scroll class
  await expect(carouselTrack).toHaveClass(/infinite-scroll/);

  // Scroll down to make it disappear (trigger global observer)
  await page.evaluate(() => window.scrollTo(0, 3000));

  // Wait a bit for observer to kick in
  await page.waitForTimeout(1000);

  // Check if it has the paused class (from Base.astro global optimizer)
  // Use a softer assertion in case timing is tricky, or log the class
  const classAttribute = await carouselTrack.getAttribute('class');
  console.log('Class attribute after scroll:', classAttribute);

  // If the test fails here, it means the IntersectionObserver didn't trigger
  await expect(carouselTrack).toHaveClass(/paused/);

  // Take a screenshot of the paused state (though it's off screen, we can verify class presence)
  await page.screenshot({ path: 'e2e_verification/carousel-paused.png' });

  // Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Check if paused class is removed
  await expect(carouselTrack).not.toHaveClass(/paused/);
});
