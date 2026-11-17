import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 1 — Onboarding & Talent Intake', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('TC-T1-ONB-01: Renders onboarding header and candidate pipeline table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Onboarding' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Vikram Rao')).toBeVisible();
  });

  test('TC-T1-ONB-02: Filters candidate list by lifecycle status', async ({ page }) => {
    await page.getByRole('button', { name: 'READY FOR DAY ONE' }).click();
    await expect(page.getByText('Vikram Rao')).toBeVisible();
    await expect(page.getByText('Karan Mehta')).not.toBeVisible();

    await page.getByRole('button', { name: 'INVITED' }).click();
    await expect(page.getByText('Karan Mehta')).toBeVisible();
    await expect(page.getByText('Vikram Rao')).not.toBeVisible();
  });

  test('TC-T1-ONB-03: Opens Invite Candidate dialog and submits new candidate', async ({ page }) => {
    await page.getByRole('button', { name: 'Invite Candidate' }).click();
    await expect(page.getByText('Invite Candidate to Onboard')).toBeVisible();

    await page.getByPlaceholder('e.g. Arjun').fill('Siddharth');
    await page.getByPlaceholder('e.g. Reddy').fill('Varma');
    await page.getByPlaceholder('arjun.reddy@example.com').fill('siddharth.varma@example.com');

    await page.getByRole('button', { name: 'Send Invitation' }).click();
    await expect(page.getByText('Siddharth Varma')).toBeVisible();
  });

  test('TC-T1-ONB-04: Verifies documents for pending candidate and updates status', async ({ page }) => {
    const verifyBtn = page.getByRole('button', { name: 'Verify All Docs' }).first();
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
      await expect(page.getByText('Ready For Day One').first()).toBeVisible();
    }
  });

  test('TC-T1-ONB-05: Executes atomic Convert to Employee action', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: 'Convert to Employee →' }).first();
    await expect(convertBtn).toBeVisible();
    await convertBtn.click();

    await expect(page.getByText('Convert to Employee', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm & Convert' }).click();
    await expect(page.getByText('Active in DBMS').first()).toBeVisible();
  });
});
