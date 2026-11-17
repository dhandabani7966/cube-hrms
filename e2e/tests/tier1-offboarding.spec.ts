import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 6 — Offboarding & Exit Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/offboarding');
  });

  test('TC-T1-OFF-01: Renders separation pipeline with employee resignations', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Offboarding & Exit Management' })).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('EMP-10003')).toBeVisible();
    await expect(page.getByText('CLEARANCE IN PROGRESS').first()).toBeVisible();
  });

  test('TC-T1-OFF-02: Submits voluntary resignation and adds it to separation pipeline', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit Resignation' }).click();
    await expect(page.getByText('Submit Voluntary Resignation', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Submit Resignation' }).nth(1).click();
    await expect(page.getByText('John Doe (Self)')).toBeVisible();
  });

  test('TC-T1-OFF-03: Inspects multi-departmental NOC clearance matrix', async ({ page }) => {
    await page.getByText('John Doe').first().click();
    await expect(page.getByText('Multi-Departmental NOC Clearance Matrix')).toBeVisible();
    await expect(page.getByText('IT Department Clearance')).toBeVisible();
    await expect(page.getByText('Admin & Facility Clearance')).toBeVisible();
    await expect(page.getByText('Finance & Payroll Clearance')).toBeVisible();
    await expect(page.getByText('HR & Line Manager Clearance')).toBeVisible();
  });

  test('TC-T1-OFF-04: Toggles department clearance status in NOC matrix', async ({ page }) => {
    await page.getByText('John Doe').first().click();
    const adminBtn = page.getByRole('button', { name: 'Pending' }).first();
    if (await adminBtn.isVisible()) {
      await adminBtn.click();
      await expect(page.getByRole('button', { name: 'Cleared' }).first()).toBeVisible();
    }
  });

  test('TC-T1-OFF-05: Inspects Full & Final (F&F) settlement sheet breakdown', async ({ page }) => {
    await page.getByText('John Doe').first().click();
    await expect(page.getByText('Full & Final (F&F) Settlement Sheet')).toBeVisible();
    await expect(page.getByText('Earned Salary (Days worked in final month):')).toBeVisible();
    await expect(page.getByText('Leave Encashment (10 days accrued leave):')).toBeVisible();
    await expect(page.getByText('Net Payable to Employee:')).toBeVisible();
    await expect(page.getByText('100,833.33').first()).toBeVisible();
  });
});
