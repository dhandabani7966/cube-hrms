import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 5 — Document Management & Files (Cube AI Solutions)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/documents');
    await page.waitForLoadState('networkidle');
  });

  test('TC-T1-DOC-01: Renders Top Header & Navigation Tabs', async ({ page }) => {
    // Back button with Files label
    await expect(page.getByRole('button', { name: 'Files', exact: true })).toBeVisible();

    // Top navigation tabs
    await expect(page.getByRole('button', { name: 'Organization Files', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employee Files' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HR Forms & Templates' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Folders' })).toBeVisible();

    // Right-side actions
    await expect(page.getByTitle('Add File')).toBeVisible();
    await expect(page.getByTitle('Search')).toBeVisible();
    await expect(page.getByTitle('Notifications')).toBeVisible();
    await expect(page.getByTitle('Settings')).toBeVisible();
  });

  test('TC-T1-DOC-02: Renders Scope Sidebar and Mascot Empty State', async ({ page }) => {
    // Left scope pills
    await expect(page.getByRole('button', { name: 'Location' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Department' })).toBeVisible();

    // Empty state heading & description
    await expect(page.getByRole('heading', { name: /No organization file added/i })).toBeVisible();
    await expect(
      page.getByText(/Upload important common files such as policies or company handbooks/i),
    ).toBeVisible();

    // Primary action button
    await expect(page.getByRole('button', { name: /Add Organization Files/i })).toBeVisible();
  });

  test('TC-T1-DOC-03: Opens modal and adds a new organization file', async ({ page }) => {
    // Click Add Organization Files
    await page.getByRole('button', { name: /Add Organization Files/i }).click();

    // Modal appears
    await expect(page.getByRole('heading', { name: /Add Organization Files/i })).toBeVisible();

    // Fill form
    const docName = `CubeAI_Policy_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Employee Handbook 2026/i).fill(docName);
    await page.getByRole('button', { name: /Upload File/i }).click();

    // Check confirmation toast and presence in table
    await expect(page.getByText(/added successfully/i)).toBeVisible();
    await expect(page.locator('tbody').getByText(new RegExp(docName, 'i'))).toBeVisible();
  });

  test('TC-T1-DOC-04: Scope switching between Location and Department', async ({ page }) => {
    // Click Department pill
    await page.getByRole('button', { name: 'Department' }).click();
    await expect(page.getByRole('button', { name: 'Department' })).toHaveClass(/font-bold/);

    // Click Location pill
    await page.getByRole('button', { name: 'Location' }).click();
    await expect(page.getByRole('button', { name: 'Location' })).toHaveClass(/font-bold/);
  });

  test('TC-T1-DOC-05: Tab switching across Organization, Employee, HR Forms, and Folders', async ({ page }) => {
    await page.getByRole('button', { name: 'Employee Files' }).click();
    await expect(page.getByRole('button', { name: 'Employee Files' })).toHaveClass(/font-bold/);

    await page.getByRole('button', { name: 'HR Forms & Templates' }).click();
    await expect(page.getByRole('button', { name: 'HR Forms & Templates' })).toHaveClass(/font-bold/);

    await page.getByRole('button', { name: 'Folders' }).click();
    await expect(page.getByRole('button', { name: 'Folders' })).toHaveClass(/font-bold/);

    await page.getByRole('button', { name: 'Organization Files', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Organization Files', exact: true })).toHaveClass(/font-bold/);
  });
});
