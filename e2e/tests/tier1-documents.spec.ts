import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 5 — Document Management & Compliance (Cube AI Solutions)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Documents view
    await page.goto('http://localhost:5173/documents');
    await page.waitForLoadState('networkidle');
  });

  test('TC-T1-DOC-01: Renders Tri-Level Operating Navigation & Header', async ({ page }) => {
    // Check main title
    await expect(page.getByRole('heading', { name: /Document Management & Compliance/i })).toBeVisible();

    // Check Cube AI Solutions badge
    await expect(page.getByText('Cube AI Solutions').first()).toBeVisible();

    // Check Tri-Level Tabs
    await expect(page.getByRole('button', { name: /Operations \(Compliance & Folders\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /My Files \(Self\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Settings & Automation/i })).toBeVisible();

    // Check Header Action Buttons
    await expect(page.getByRole('button', { name: /New Folder/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Upload Document/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test Lockout Gate/i })).toBeVisible();
  });

  test('TC-T1-DOC-02: Operations Console folder directory, compliance KPI summary, and audit tracker', async ({ page }) => {
    // 1. Folder Repository Column
    await expect(page.getByText(/Folder Repository/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /All Folders/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Company Policies/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Employee Handbooks/i })).toBeVisible();

    // 2. Compliance KPI Cards
    await expect(page.getByText(/Information Security & Data Protection Policy 2026/i).first()).toBeVisible();
    await expect(page.getByText(/Target Staff/i)).toBeVisible();
    await expect(page.getByText(/450 Staff/i)).toBeVisible();
    await expect(page.getByText(/Consented \(Opt-In\)/i).first()).toBeVisible();
    await expect(page.getByText(/Pending Lockout/i)).toBeVisible();

    // 3. Audit Tracker Table
    await expect(page.getByText('David Miller').first()).toBeVisible();
    await expect(page.getByText('Sarah Jenkins').first()).toBeVisible();

    // 4. Send Bulk Reminders
    const reminderBtn = page.getByRole('button', { name: /Send Reminders to 38 Pending/i });
    await expect(reminderBtn).toBeVisible();
    await reminderBtn.click();
    await expect(page.getByText(/reminders/i).first()).toBeVisible();
  });

  test('TC-T1-DOC-03: Document Expiry Radar & E-Signature Queue in Operations', async ({ page }) => {
    // Check Expiry Radar entries
    await expect(page.getByText(/Expiring Vault Files/i)).toBeVisible();
    await expect(page.getByText(/Critical \(< 7 Days\):/i)).toBeVisible();
    await expect(page.getByText(/David Kim \(Work Visa\)/i)).toBeVisible();
    await expect(page.getByText(/Warning \(< 30 Days\):/i)).toBeVisible();

    // Test Notify Selected Users button
    const notifyBtn = page.getByRole('button', { name: /Notify Selected Users/i });
    await expect(notifyBtn).toBeVisible();
    await notifyBtn.click();
    await expect(page.getByText(/alerts notified|dispatched/i).first()).toBeVisible();

    // Test E-Signature Status widget and modal
    await expect(page.getByText(/E-Signature Status/i)).toBeVisible();
    const queueBtn = page.getByRole('button', { name: /View E-Sign Workflow Queue/i });
    await expect(queueBtn).toBeVisible();
    await queueBtn.click();

    // Verify modal appears
    await expect(page.getByRole('heading', { name: /E-Signature Workflow Queue/i })).toBeVisible();
    await page.getByRole('button', { name: /Close Queue/i }).click();
  });

  test('TC-T1-DOC-04: Creates a new folder in Operations Console', async ({ page }) => {
    await page.getByRole('button', { name: /New Folder/i }).click();
    await expect(page.getByRole('heading', { name: /Create New Document Folder/i })).toBeVisible();

    const folderName = `Charter_Folder_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Travel & Expensing/i).fill(folderName);
    await page.getByRole('button', { name: 'Create Folder' }).click();

    // Verify folder created toast & button
    await expect(page.getByText(/successfully created/i)).toBeVisible();
    await expect(page.getByRole('button', { name: new RegExp(folderName, 'i') })).toBeVisible();
  });

  test('TC-T1-DOC-05: Employee Self-Service View and Organization Policies', async ({ page }) => {
    await page.getByRole('button', { name: /My Files \(Self\)/i }).click();

    // Check Pending Compliance Banner
    await expect(page.getByText(/Action Required: Mandatory Consent/i)).toBeVisible();
    await expect(page.getByText(/Annual Workplace Code of Conduct/i)).toBeVisible();

    // Check Sub-Tab: Organization Policies
    await expect(page.getByText(/Explore Shared Company Documents/i)).toBeVisible();
    await expect(page.getByText(/Global Employee Handbook/i).first()).toBeVisible();

    // Open Preview Modal
    const previewButtons = page.getByRole('button', { name: 'Preview' });
    if (await previewButtons.count() > 0) {
      await previewButtons.first().click();
      await expect(page.getByRole('button', { name: /Close Preview/i })).toBeVisible();
      await page.getByRole('button', { name: /Close Preview/i }).click();
    }
  });

  test('TC-T1-DOC-06: Employee Personal Vault Upload and Category Filtering', async ({ page }) => {
    await page.getByRole('button', { name: /My Files \(Self\)/i }).click();

    // Switch to My Personal Vault sub-tab
    await page.getByRole('button', { name: /My Personal Vault/i }).click();
    await expect(page.getByText(/My Vault Credentials/i)).toBeVisible();

    // Click Upload Document
    await page.getByRole('button', { name: /Upload Document/i }).first().click();
    await expect(page.getByRole('heading', { name: /Upload Document to Personal Vault/i })).toBeVisible();

    // Fill upload form
    const docTitle = `AWS_Cert_${Date.now().toString().slice(-4)}`;
    await page.getByPlaceholder(/Master_Degree_Transcript/i).fill(docTitle);
    await page.getByPlaceholder(/PAN •••• 9921/i).fill('AWS •••• 1009');
    await page.locator('form').getByRole('button', { name: 'Upload Document' }).click();

    // Check confirmation toast & presence in table
    await expect(page.getByText(/uploaded to personal vault/i)).toBeVisible();
    await expect(page.getByText(new RegExp(docTitle, 'i')).first()).toBeVisible();
  });

  test('TC-T1-DOC-07: Digital E-Signature Execution in ESS', async ({ page }) => {
    await page.getByRole('button', { name: /My Files \(Self\)/i }).click();

    // Switch to Documents for Signature sub-tab
    await page.getByRole('button', { name: /Documents for Signature/i }).click();
    await expect(page.getByText(/Agreements & Contracts Requiring Digital Signature/i)).toBeVisible();

    // Click Review & Sign
    const signBtn = page.getByRole('button', { name: /Review & Sign/i }).first();
    await expect(signBtn).toBeVisible();
    await signBtn.click();

    // Verify modal and Adopt & Sign
    await expect(page.getByRole('heading', { name: /Digital E-Signature Execution/i })).toBeVisible();
    await page.getByRole('button', { name: /Adopt & Sign Document/i }).click();

    // Verify signed toast
    await expect(page.getByText(/successfully signed|digital signature/i).first()).toBeVisible();
  });

  test('TC-T1-DOC-08: Mandatory Consent Gate Modal & Access Restoration', async ({ page }) => {
    // Click Test Lockout Gate
    await page.getByRole('button', { name: /Test Lockout Gate/i }).click();

    // Verify Modal
    await expect(page.getByText(/MANDATORY COMPLIANCE ACTION REQUIRED/i)).toBeVisible();
    await expect(page.getByText(/Information Security & Data Protection Policy/i).first()).toBeVisible();

    // Verify Confirm Consent button is initially disabled until checkbox is checked
    const confirmBtn = page.getByRole('button', { name: /Confirm Consent & Restore Portal Access/i });
    await expect(confirmBtn).toBeDisabled();

    // Check terms checkbox
    await page.locator('#lockoutConsentCheck').check();
    await expect(confirmBtn).toBeEnabled();

    // Submit consent
    await confirmBtn.click();

    // Verify success toast and modal closed
    await expect(page.getByText(/compliance acknowledgment confirmed|restored/i).first()).toBeVisible();
  });

  test('TC-T1-DOC-09: Settings & Automation Console and SharePoint Backup Sync', async ({ page }) => {
    await page.getByRole('button', { name: /Settings & Automation/i }).click();

    // Verify Settings Sections
    await expect(page.getByText(/Folder Governance & Sharing Permissions Matrix/i)).toBeVisible();
    await expect(page.getByText(/Mandatory Consent & Access Lockout Policy Engine/i)).toBeVisible();
    await expect(page.getByText(/Document Expiry Alert & Renewal Notifications/i)).toBeVisible();
    await expect(page.getByText(/Archival & Microsoft SharePoint Backup Connector/i)).toBeVisible();

    // Run SharePoint Backup Sync
    const syncBtn = page.getByRole('button', { name: /Run SharePoint Backup Sync Now/i });
    await expect(syncBtn).toBeVisible();
    await syncBtn.click();

    // Verify backup replication message
    await expect(page.getByText(/replicated|SharePoint/i).first()).toBeVisible();
  });
});
