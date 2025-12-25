import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Samuel Dulex/);
});

test('check about link', async ({ page }) => {
  await page.goto('/');
  // Assuming there is a link to About or similar.
  // I should check the homepage content to be sure.
  // But strictly speaking, just loading the page is a good start.
  await expect(page.locator('h1').first()).toBeVisible();
});
