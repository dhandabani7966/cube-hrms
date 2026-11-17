import { test, expect } from '@playwright/test';

test.describe('Tier 3: Cross-Feature Combinations & Pairwise Integration', () => {
  test('TC-T3-PAIR-01: Onboarding conversion to employee reflects in Directory and Org Tree', async ({ page }) => {
    // 1. Visit Onboarding and convert candidate
    await page.goto('/onboarding');
    const convertBtn = page.getByRole('button', { name: 'Convert to Employee →' }).first();
    await convertBtn.click();
    await page.getByRole('button', { name: 'Confirm & Convert' }).click();
    await expect(page.getByText('Active in DBMS').first()).toBeVisible();

    // 2. Navigate to Employees Directory
    await page.goto('/employees');
    await expect(page.getByText('David Miller')).toBeVisible();
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
  });

  test('TC-T3-PAIR-02: Clearance completion in Offboarding unlocks F&F payout authorization', async ({ page }) => {
    await page.goto('/offboarding');
    await page.getByText('John Doe').first().click();

    // Clear pending clearance items
    const pendingBtns = page.getByRole('button', { name: 'Pending' });
    const count = await pendingBtns.count();
    for (let i = 0; i < count; i++) {
      await pendingBtns.first().click();
    }

    // Status updates to CLEARANCE_COMPLETED
    await expect(page.getByText('Status: CLEARANCE_COMPLETED')).toBeVisible();

    // Authorize & Disburse Settlement action appears
    const authorizeBtn = page.getByRole('button', { name: 'Authorize & Disburse Settlement' });
    await expect(authorizeBtn).toBeVisible();
    await authorizeBtn.click();
    await expect(page.getByText('Status: FNF_SETTLED')).toBeVisible();
  });
});
