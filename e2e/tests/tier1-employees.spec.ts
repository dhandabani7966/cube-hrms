import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 2 — Employee DBMS & Org Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employees');
  });

  test('TC-T1-EMP-01: Renders employee directory with table of personnel records', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Employee DBMS & Org Structure' })).toBeVisible();
    await expect(page.getByText('David Miller')).toBeVisible();
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('TC-T1-EMP-02: Filters directory by text search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name, ID or email...');
    await searchInput.fill('Sarah');
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
    await expect(page.getByText('David Miller')).not.toBeVisible();
    await searchInput.fill('');
  });

  test('TC-T1-EMP-03: Filters directory by Department dropdown', async ({ page }) => {
    const deptSelect = page.locator('select').nth(2);
    await deptSelect.selectOption('Engineering');
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
    await expect(page.getByText('David Miller')).not.toBeVisible();
  });

  test('TC-T1-EMP-04: Opens 360-degree employee profile modal with masked statutory data', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: 'View Profile' }).first();
    await profileBtn.click();

    await expect(page.getByText('Job & Organization')).toBeVisible();
    await expect(page.getByText('Statutory & Financials (RBAC Protected)')).toBeVisible();
    await expect(page.getByText('Aadhaar Number:')).toBeVisible();
    await expect(page.getByText(/XXXX-XXXX-/).first()).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('TC-T1-EMP-05: Navigates to Org Tree tab and inspects closure hierarchy tree', async ({ page }) => {
    await page.getByRole('button', { name: 'Org Tree' }).click();
    await expect(page.getByText('ROOT LEVEL • CEO')).toBeVisible();
    await expect(page.getByText('David Miller')).toBeVisible();
    await expect(page.getByText('DIRECT REPORT • L1').first()).toBeVisible();
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
  });

  test('TC-T1-EMP-06: Navigates to Departments tab and views department head assignments', async ({ page }) => {
    await page.getByRole('button', { name: 'Departments' }).click();
    await expect(page.getByRole('heading', { name: 'Engineering', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Human Resources', exact: true })).toBeVisible();
    await expect(page.getByText('Lead: Sarah Jenkins')).toBeVisible();
  });
});
