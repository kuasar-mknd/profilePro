import { test, expect } from '@playwright/test';
import config from '../src/config.mjs';

test('homepage loads and has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(new RegExp(config.title));
});
