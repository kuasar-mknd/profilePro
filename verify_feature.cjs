const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: '/app/verification/video' }
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4321/project');
    await page.waitForTimeout(500);

    // Verify filter buttons exist
    const filtersNav = page.locator('nav[aria-label="Filtres de projets"]');
    await filtersNav.waitFor();
    await page.waitForTimeout(500);

    // Click on a tag filter
    const firstTagFilter = filtersNav.locator('a.project-filter-link').nth(1); // 'Tous' is 0
    await firstTagFilter.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/app/verification/verification.png' });
    await page.waitForTimeout(500);
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await context.close();
    await browser.close();
  }
}

if (!fs.existsSync('/app/verification/video')) {
  fs.mkdirSync('/app/verification/video', { recursive: true });
}

run();
