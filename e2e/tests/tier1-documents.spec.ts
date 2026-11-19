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

    // Right-side action icons
    await expect(page.getByTitle('Add File')).toBeVisible();
    await expect(page.getByTitle('Search')).toBeVisible();
    await expect(page.getByTitle('Notifications')).toBeVisible();
    await expect(page.getByTitle('Settings')).toBeVisible();
  });

  test('TC-T1-DOC-02: Renders Scope Sidebar and Organization Files Workspace', async ({ page }) => {
    // Left scope pills
    await expect(page.getByRole('button', { name: 'Location' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Department' })).toBeVisible();

    // Either empty state mascot OR populated table is visible
    const emptyStateHeading = page.getByRole('heading', { name: /No organization file added/i });
    const isEmpVisible = await emptyStateHeading.isVisible().catch(() => false);
    if (isEmpVisible) {
      await expect(
        page.getByText(/Upload important common files such as policies or company handbooks/i),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: /Add Organization Files/i })).toBeVisible();
    } else {
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('TC-T1-DOC-03: Opens slide-over drawer and adds a new organization file with policy flag', async ({ page }) => {
    // Open Add Organization Files drawer via top header plus button
    await page.getByTitle('Add File').click();

    // Slide-over drawer appears
    await expect(page.getByRole('heading', { name: /Add organization file/i })).toBeVisible();
    await expect(page.getByText(/Desktop/i)).toBeVisible();
    await expect(page.getByText(/Cloud Storage/i)).toBeVisible();

    // Fill file name
    const docName = `CubeAI_Policy_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Enter a name for the file/i).fill(docName);

    // Check policy document checkbox
    await page.getByLabel(/Mark as organization policy document/i).check();

    // Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Check confirmation toast and presence in table
    await expect(page.getByText(/added successfully/i)).toBeVisible();
    await expect(page.locator('tbody').getByText(new RegExp(docName, 'i')).first()).toBeVisible();
  });

  test('TC-T1-DOC-04: Scope switching between Location and Department', async ({ page }) => {
    // Click Department pill
    await page.getByRole('button', { name: 'Department' }).click();
    await expect(page.getByRole('button', { name: 'Department' })).toHaveClass(/font-bold/);

    // Click Location pill
    await page.getByRole('button', { name: 'Location' }).click();
    await expect(page.getByRole('button', { name: 'Location' })).toHaveClass(/font-bold/);
  });

  test('TC-T1-DOC-05: Employee Files tab and Add Employee File drawer', async ({ page }) => {
    // Switch to Employee Files tab
    await page.getByRole('button', { name: 'Employee Files', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Employee Files', exact: true })).toHaveClass(/font-bold/);

    // Check if empty or populated, open drawer
    const emptyEmpBtn = page.getByRole('button', { name: /Add Employee Files/i });
    if (await emptyEmpBtn.isVisible().catch(() => false)) {
      await emptyEmpBtn.click();
    } else {
      await page.getByTitle('Add File').click();
    }

    // Drawer appears
    await expect(page.getByRole('heading', { name: /Add employee file/i })).toBeVisible();
    await expect(page.getByText(/File access/i)).toBeVisible();
    await expect(page.getByText(/Employee Status/i)).toBeVisible();
    await expect(page.getByText('Acknowledge', { exact: true })).toBeVisible();

    // Fill employee file name
    const empFileName = `Employment_Contract_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Enter a name for the file/i).fill(empFileName);

    // Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Check confirmation and file in table
    await expect(page.getByText(/uploaded successfully/i)).toBeVisible();
    await expect(page.locator('tbody').getByText(new RegExp(empFileName, 'i')).first()).toBeVisible();
  });

  test('TC-T1-DOC-06: HR Forms & Templates selection, bulk delete toolbar, and Merge & Add to Organization file', async ({ page }) => {
    // Switch to HR Forms & Templates tab
    await page.getByRole('button', { name: 'HR Forms & Templates' }).click();
    await expect(page.getByRole('button', { name: 'HR Forms & Templates' })).toHaveClass(/font-bold/);

    // Verify seeded templates exist
    await expect(page.getByText(/Company Handbook Template/i).first()).toBeVisible();

    // Check individual template checkbox
    const firstCheckbox = page.locator('tbody input[type="checkbox"]').first();
    await firstCheckbox.check();

    // Red top delete toolbar should appear
    await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
    await expect(page.getByText(/1 item\(s\) selected/i)).toBeVisible();

    // Click More Horizontal (...) menu on the first template row
    const moreBtn = page.locator('tbody tr').first().getByTitle('Actions');
    await moreBtn.click();

    // Dropdown options visible
    await expect(page.getByRole('button', { name: /Edit template/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Merge & Add to organization file/i })).toBeVisible();

    // Click Merge & Add to organization file
    await page.getByRole('button', { name: /Merge & Add to organization file/i }).click();

    // Confirmation toast
    await expect(page.getByText(/merged and added to Organization Files/i)).toBeVisible();

    // Verify it now appears in Organization Files
    await page.getByRole('button', { name: 'Organization Files', exact: true }).click();
    await expect(page.locator('tbody').getByText(/Company Handbook Template/i).first()).toBeVisible();
  });

  test('TC-T1-DOC-07: Folders tab renders directory cards and creates new folder', async ({ page }) => {
    // Switch to Folders tab
    await page.getByRole('button', { name: 'Folders' }).click();
    await expect(page.getByRole('button', { name: 'Folders' })).toHaveClass(/font-bold/);

    // Verify existing folders
    await expect(page.getByText(/Company Policies/i).first()).toBeVisible();
    await expect(page.getByText(/Employee Handbooks/i).first()).toBeVisible();

    // Click New Folder
    await page.getByRole('button', { name: /New Folder/i }).click();
    await expect(page.getByRole('heading', { name: /Create Document Folder/i })).toBeVisible();

    const folderTitle = `Compliance_Docs_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Health & Safety Compliance/i).fill(folderTitle);
    await page.getByRole('button', { name: /Create Folder/i }).click();

    // Check new folder card is created
    await expect(page.getByRole('heading', { name: folderTitle })).toBeVisible();
  });
});
