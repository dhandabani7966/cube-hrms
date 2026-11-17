import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 5 — Document Management & Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents');
  });

  test('TC-T1-DOC-01: Renders Policy Hub with mandatory organization policies', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Document Management & Compliance' })).toBeVisible();
    await expect(page.getByText('Information Security & Data Protection Policy')).toBeVisible();
    await expect(page.getByText('Prevention of Sexual Harassment (POSH) Policy')).toBeVisible();
  });

  test('TC-T1-DOC-02: Acknowledges unconsented mandatory policy with digital signature log', async ({ page }) => {
    const ackBtn = page.getByRole('button', { name: 'Read & Acknowledge Policy' }).first();
    if (await ackBtn.isVisible()) {
      await ackBtn.click();
      await expect(page.getByText('Digital Signature logged with Client IP')).toBeVisible();
      await page.getByRole('button', { name: 'I Agree & Acknowledge' }).click();
      await expect(page.getByText('Acknowledged').first()).toBeVisible();
    }
  });

  test('TC-T1-DOC-03: Navigates to Employee Vault and inspects document files', async ({ page }) => {
    await page.getByRole('button', { name: 'Employee Vault' }).click();
    await expect(page.getByText('PAN Card Copy')).toBeVisible();
    await expect(page.getByText('Passport Front & Back')).toBeVisible();
    await expect(page.getByText('VERIFIED').first()).toBeVisible();
  });

  test('TC-T1-DOC-04: Navigates to Expiry Radar and reviews statutory document deadlines', async ({ page }) => {
    await page.getByRole('button', { name: 'Expiry Radar' }).click();
    await expect(page.getByText('Statutory Renewal Radar:')).toBeVisible();
    await expect(page.getByText('Expires Soon (<60 Days)').first()).toBeVisible();
  });
});
