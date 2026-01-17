import { test, expect } from '@playwright/test';

test('social icons have custom tooltips', async ({ page }) => {
  await page.goto('/');

  const githubLink = page.getByRole('link', { name: /GitHub/ });
  await githubLink.scrollIntoViewIfNeeded();

  // Verify native title is removed (or opted out)
  const title = await githubLink.getAttribute('title');
  expect(title).toBeFalsy();

  await githubLink.hover();

  // Wait a bit for transition
  await page.waitForTimeout(500);

  // Target the tooltip (not the sr-only text)
  const tooltip = githubLink.locator('span:not(.sr-only)');

  // Verify text content
  await expect(tooltip).toContainText("GitHub");

  // Verify visibility
  await expect(tooltip).toBeVisible();
});
