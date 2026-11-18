import { test, expect } from '@playwright/test';

test.describe('Onboarding Candidates Advanced Operations & Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('TC-ONB-ADV-01: Filter drawer with 3-lines icon and 27 fields column toggling', async ({ page }) => {
    // 1. Click tapered 3-lines filter button
    const filterBtn = page.getByTitle('Filter and Columns');
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();

    // 2. Filter drawer is open
    await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();
    await expect(page.getByText('System filters')).toBeVisible();
    await expect(page.getByText('Fields')).toBeVisible();

    // 3. Test filtering fields by search query
    const searchInput = page.getByPlaceholder('Search');
    await searchInput.fill('Salary');
    await expect(page.getByText('Current Salary')).toBeVisible();

    // 4. Toggle Current Salary column on
    const salaryCheckbox = page.locator('label', { hasText: 'Current Salary' }).locator('input[type="checkbox"]');
    await salaryCheckbox.check();

    // 5. Click Apply
    await page.getByRole('button', { name: 'Apply' }).click();

    // 6. Verify Current Salary column header appears in table
    await expect(page.getByText('Current Salary').first()).toBeVisible();
  });

  test('TC-ONB-ADV-02: 3-dots options menu provides Import, Export, History, Bulk Upload, Access Log', async ({ page }) => {
    // 1. Click 3-dots button
    const moreBtn = page.getByTitle('More Actions');
    await expect(moreBtn).toBeVisible();
    await moreBtn.click();

    // 2. Options are displayed
    await expect(page.getByRole('button', { name: 'Import', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'History Export', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bulk File Upload', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Access Log', exact: true })).toBeVisible();

    // 3. Open Import modal
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Import Candidates' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 4. Open Bulk File Upload modal
    await moreBtn.click();
    await page.getByRole('button', { name: 'Bulk File Upload', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Bulk File Upload' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  });

  test('TC-ONB-ADV-03: Massive Operations Bar: Mass update, Convert To, and Delete', async ({ page }) => {
    // 1. Select the first candidate checkbox
    const firstRowCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await firstRowCheckbox.check();

    // 2. Massive Operations Bar appears
    await expect(page.getByText('1 selected')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mass update', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Convert To', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();

    // 3. Open Mass Update Modal
    await page.getByRole('button', { name: 'Mass update', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Mass update', exact: true })).toBeVisible();
    await expect(page.getByText('Mass update will update all the matching records.')).toBeVisible();
    await expect(page.getByText('Field Name')).toBeVisible();
    await expect(page.getByText('Value')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add new', exact: true })).toBeVisible();

    // 4. Cancel Mass update
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 5. Test Convert To ▾ dropdown
    await page.getByRole('button', { name: 'Convert To', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Invite Users', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employee Profile(s)', exact: true })).toBeVisible();

    // 6. Test Clear selection
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByRole('button', { name: 'Mass update' })).not.toBeVisible();
  });
});
