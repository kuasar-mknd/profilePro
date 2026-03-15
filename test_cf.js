const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set the token
  process.env.PUBLIC_CF_ANALYTICS_TOKEN = "test_token_123";

  // Need to run build first to pick up the token?
  // We can just verify the file content, it's simpler.

  await browser.close();
})();
