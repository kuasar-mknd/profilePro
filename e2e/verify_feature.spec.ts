import { test, expect } from '@playwright/test';

test('Verify form validation caching', async ({ page }) => {
  await page.goto('/');

  const contactButton = page.locator('#hero-cta-secondary');
  await contactButton.click();

  const nameInput = page.locator('input[name="name"]');
  const emailInput = page.locator('input[name="email"]');

  await nameInput.fill('Sam');
  const nameIcon = nameInput.locator('xpath=following-sibling::div[contains(@class, "validation-icon")]');
  await expect(nameIcon).toHaveAttribute('data-visible', 'true');

  await emailInput.fill('invalid-email');
  const emailIcon = emailInput.locator('xpath=following-sibling::div[contains(@class, "validation-icon")]');
  await expect(emailIcon).toHaveAttribute('data-visible', 'false');

  await emailInput.fill('test@example.com');
  await expect(emailIcon).toHaveAttribute('data-visible', 'true');

  await page.screenshot({ path: '/home/jules/verification/verification.png' });
});