import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 3 — Employee Self-Service (ESS)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ess');
  });

  test('TC-T1-ESS-01: Renders ESS portal with employee profile card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Employee Self-Service (ESS)' })).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('EMP-10003 • Principal Software Engineer')).toBeVisible();
  });

  test('TC-T1-ESS-02: Toggles peer directory privacy controls', async ({ page }) => {
    const phoneCheckbox = page.locator('input[type="checkbox"]').first();
    const isInitiallyChecked = await phoneCheckbox.isChecked();
    await phoneCheckbox.click();
    expect(await phoneCheckbox.isChecked()).toBe(!isInitiallyChecked);
  });

  test('TC-T1-ESS-03: Submits profile information correction request with feedback banner', async ({ page }) => {
    const input = page.getByPlaceholder('Enter updated information...');
    await input.fill('Flat 402, Green Glen Layout, Bellandur, Bangalore');
    await page.getByRole('button', { name: 'Submit Change Request' }).click();

    await expect(page.getByText('Request submitted successfully. Awaiting HR review.')).toBeVisible();
  });

  test('TC-T1-ESS-04: Submits approval authority delegation during manager absence', async ({ page }) => {
    await page.getByRole('button', { name: 'Activate Delegation' }).click();
    await expect(page.getByText('Authority delegation active for specified date range.')).toBeVisible();
  });

  test('TC-T1-ESS-05: Displays official company announcements and noticeboard bulletins', async ({ page }) => {
    await expect(page.getByText('CubeAI Annual All-Hands & Strategy Summit 2026')).toBeVisible();
    await expect(page.getByText('INFO', { exact: true })).toBeVisible();
  });
});
