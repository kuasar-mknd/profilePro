
import { test, expect } from '@playwright/test';

test.describe('Palette UX Verification', () => {
  test('ModeSwitch should toggle theme on click and with keyboard shortcut', async ({ page }) => {
    await page.goto('http://localhost:4321/');

    // 1. Initial state
    await page.screenshot({ path: 'e2e/screenshots/palette-verify-01-light.png' });

    // 2. Click to toggle dark mode
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(500); // Wait for transition
    await page.screenshot({ path: 'e2e/screenshots/palette-verify-02-dark.png' });

    // 3. Use keyboard shortcut to toggle back to light mode
    await page.press('body', 'Control+.');
    await page.waitForTimeout(500); // Wait for transition
    await page.screenshot({ path: 'e2e/screenshots/palette-verify-03-light-again.png' });
  });
});
