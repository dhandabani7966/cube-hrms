import { test, expect } from '@playwright/test';

test.describe('Tier 1: Multi-Tenancy & RBAC Security', () => {
  test('TC-T1-SEC-01: Switches tenant in header and updates corporate context', async ({ page }) => {
    await page.goto('/');
    const tenantSelect = page.locator('select').first();
    await tenantSelect.selectOption({ label: 'Globex Corp (GLOBEX)' });
    await expect(tenantSelect).toHaveValue('22222222-2222-2222-2222-222222222222');

    // Switch back to Acme
    await tenantSelect.selectOption({ label: 'Acme Technologies Inc. (ACME)' });
    await expect(tenantSelect).toHaveValue('11111111-1111-1111-1111-111111111111');
  });

  test('TC-T1-SEC-02: Switches authenticated persona and updates role badge', async ({ page }) => {
    await page.goto('/');
    const roleSelect = page.locator('select').nth(1);
    await roleSelect.selectOption('LINE_MANAGER');
    await expect(page.getByText('Sarah (Manager)')).toBeVisible();

    await roleSelect.selectOption('EMPLOYEE');
    await expect(page.getByText('John (Employee)')).toBeVisible();

    await roleSelect.selectOption('HR_ADMIN');
    await expect(page.getByText('HR Administrator')).toBeVisible();
  });

  test('TC-T1-SEC-03: Verifies unmasking sensitive data is restricted to HR Admin', async ({ page }) => {
    await page.goto('/employees');
    // As HR Admin, view profile has unmask button
    await page.getByRole('button', { name: 'View Profile' }).first().click();
    await expect(page.getByRole('button', { name: 'Unmask (Audited)' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();

    // Switch to Employee role
    const roleSelect = page.locator('select').nth(1);
    await roleSelect.selectOption('EMPLOYEE');

    // As Employee, Unmask button should not be accessible
    await page.getByRole('button', { name: 'View Profile' }).first().click();
    await expect(page.getByRole('button', { name: 'Unmask (Audited)' })).not.toBeVisible();
  });
});
