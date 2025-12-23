import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:4321');

    // Check initial state
    const btn = page.locator('.theme-toggle-btn').first();
    const initialLabel = await btn.getAttribute('aria-label');
    console.log('Initial label:', initialLabel);

    // Take screenshot of initial state
    await page.screenshot({ path: 'verification/initial.png' });

    // Click toggle
    await btn.click();

    // Check label after toggle
    const newLabel = await btn.getAttribute('aria-label');
    console.log('New label:', newLabel);

    // Take screenshot after toggle
    await page.screenshot({ path: 'verification/toggled.png' });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
