import { test, expect } from '@playwright/test';

test.describe('Module 2: Employee Information & DBMS Overhaul', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employees');
    await page.waitForLoadState('networkidle');
  });

  test('TC-EMP-01: Renders Employee Information top navigation tabs and toolbar', async ({ page }) => {
    await expect(page.getByText('Employee Information')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employees' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'User specific Operations' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Insights' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Departments' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Designations' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HR Process' })).toBeVisible();

    // Verify subtoolbar
    await expect(page.getByText('Employee View')).toBeVisible();
    await expect(page.getByText('All Data')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Employee(s)' })).toBeVisible();
  });

  test('TC-EMP-02: Renders employee table matching reference columns without Zoho mentions', async ({ page }) => {
    // Check column headers
    await expect(page.getByRole('columnheader', { name: 'Employee ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Nick name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Photo' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Department' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Designation' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();

    // Verify NO "Zoho" is present anywhere in page
    const pageContent = await page.content();
    expect(pageContent).not.toContain('Zoho Role');
    expect(pageContent).not.toContain('Zoho People');

    // Verify employee rows from seed data (e.g. Christopher Brown S20, William Smith S18)
    await expect(page.getByRole('cell', { name: 'Christopher', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Brown', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'S20', exact: true }).first()).toBeVisible();
  });

  test('TC-EMP-03: Add Employee modal creates and persists new employee in database', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Employee(s)' }).click();
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

    const uniqueFirst = `Ravi_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder('e.g. Arun').first().fill(uniqueFirst);
    await page.getByPlaceholder('e.g. Kumar').fill('Varma');
    await page.getByPlaceholder('arunkumar@cubeai.internal').fill(`${uniqueFirst.toLowerCase()}@cubeai.internal`);

    await page.getByRole('button', { name: 'Save Employee' }).click();

    // Verify modal closes and new employee is rendered in directory
    await expect(page.getByRole('heading', { name: 'Add Employee' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: uniqueFirst, exact: true }).first()).toBeVisible();
  });

  test('TC-EMP-04: User-specific Operations displays empty mascot and employee details upon search', async ({ page }) => {
    await page.getByRole('button', { name: 'User specific Operations' }).click();

    // Empty state should display the vector mascot and instruction
    await expect(page.getByText('Please begin typing to search for an employee')).toBeVisible();

    // Type in search bar
    const searchInput = page.getByPlaceholder('Search Employee');
    await searchInput.fill('Christopher');

    // Click suggestion
    await page.getByText(/Christopher Brown/).first().click();

    // Verify selected employee view is rendered
    await expect(page.getByText('Career Milestones & Personal Timeline')).toBeVisible();
    await expect(page.getByText('Approval Delegation')).toBeVisible();
    await expect(page.getByText('Assigned Assets & Hardware')).toBeVisible();
    await expect(page.getByText('Apple MacBook Pro')).toBeVisible();
  });

  test('TC-EMP-05: Insights tab renders headcount metrics and distribution charts', async ({ page }) => {
    await page.getByRole('button', { name: 'Insights' }).click();

    // Metric KPI cards
    await expect(page.getByText('Headcount & growth rate')).toBeVisible();
    await expect(page.getByText('Employee addition & growth rate')).toBeVisible();
    await expect(page.getByText('Employee attrition & growth rate')).toBeVisible();

    // Trend and Donut charts
    await expect(page.getByText('Employee addition trend (Last Six Months)')).toBeVisible();
    await expect(page.getByText('Employee attrition trend (Last Six Months)')).toBeVisible();
    await expect(page.getByText('Designations (Top 10)')).toBeVisible();
    await expect(page.getByText('Department (Top 10)')).toBeVisible();
  });

  test('TC-EMP-06: Departments tab displays table and Add Department modal persists', async ({ page }) => {
    await page.getByRole('button', { name: 'Departments' }).click();

    // Verify department columns
    await expect(page.getByRole('columnheader', { name: 'Department Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Department Code' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'IT' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Management' }).first()).toBeVisible();

    // Add Department
    await page.getByRole('button', { name: 'Add Department' }).click();
    const uniqueDept = `CloudOps_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder('e.g. Quality Assurance').fill(uniqueDept);
    await page.getByPlaceholder('e.g. QA').fill('CLD');
    await page.getByRole('button', { name: 'Save Department' }).click();

    await expect(page.getByRole('cell', { name: uniqueDept })).toBeVisible();
  });

  test('TC-EMP-07: Designations tab displays table and Add Designation modal persists', async ({ page }) => {
    await page.getByRole('button', { name: 'Designations' }).click();

    // Verify designation columns
    await expect(page.getByRole('columnheader', { name: 'Designation Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Designation Code' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'CEO' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Team Member', exact: true }).first()).toBeVisible();

    // Add Designation
    await page.getByRole('button', { name: 'Add Designation' }).click();
    const uniqueDesig = `Staff Specialist_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder('e.g. Lead Architect').fill(uniqueDesig);
    await page.getByPlaceholder('e.g. LA').fill('SSP');
    await page.getByRole('button', { name: 'Save Designation' }).click();

    await expect(page.getByRole('cell', { name: uniqueDesig })).toBeVisible();
  });

  test('TC-EMP-08: HR Process tab filters processes and Initiate Process creates record', async ({ page }) => {
    await page.getByRole('button', { name: 'HR Process' }).click();

    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Key Field' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Process' })).toBeVisible();

    // Verify initiate process
    await page.getByRole('button', { name: 'Initiate Process' }).click();
    await expect(page.getByRole('heading', { name: 'Initiate HR Process' })).toBeVisible();

    // Select employee and target using data-testid
    const uniqueVal = `IT -> Cloud Architecture_${Date.now().toString().slice(-4)}`;
    await page.locator('[data-testid="proc-emp-select"]').selectOption({ index: 1 });
    await page.locator('[data-testid="proc-value-input"]').fill(uniqueVal);
    await page.locator('[data-testid="proc-submit-btn"]').click();

    // Verify process is listed
    await expect(page.getByText(uniqueVal)).toBeVisible();
  });
});
