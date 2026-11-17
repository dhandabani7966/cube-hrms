import { test, expect } from '@playwright/test';

test('HRMS web application shell renders title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CubeAI Solutions/i);
});
