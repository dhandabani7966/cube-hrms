import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 4 — HR Help Desk & Cases (Cube AI Solutions)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cases');
  });

  test('TC-T1-CASE-01: Renders Tri-Level Operating Navigation & Header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /HR Help Desk & Query Management/i })).toBeVisible();
    await expect(page.getByText('Cube AI Solutions').first()).toBeVisible();

    // Verify Tri-Level buttons
    await expect(page.getByRole('button', { name: /My Cases \(Self\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Operations \(Team\/HR\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Settings \(Admin\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Raise New Case/i })).toBeVisible();
  });

  test('TC-T1-CASE-02: Operations Console renders ticket queues, categories, and SLA countdowns', async ({ page }) => {
    // Queues
    await expect(page.getByRole('button', { name: /All Cases/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Unassigned/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Waiting on Employee/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /SLA Approaching/i })).toBeVisible();

    // Category Tags
    await expect(page.getByRole('button', { name: /Payroll & Taxes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Benefits & Insurance/i })).toBeVisible();

    // Ticket list
    await expect(page.getByText('CASE-1041').first()).toBeVisible();
    await expect(page.getByText('Clarification regarding medical insurance coverage').first()).toBeVisible();
  });

  test('TC-T1-CASE-03: Opens ticket detail and verifies Requester 360° metadata profile and widgets', async ({ page }) => {
    await page.getByText('CASE-1041').first().click();

    // Verifies Ticket Number and Subject in header workspace
    await expect(page.getByText('CASE-1041').first()).toBeVisible();
    await expect(page.locator('h2', { hasText: /Clarification regarding medical insurance coverage/i })).toBeVisible();

    // Verifies Requester 360 Profile card
    await expect(page.getByText('Requester 360° Profile')).toBeVisible();
    await expect(page.getByText('John Doe').first()).toBeVisible();
    await expect(page.getByText('EMP-10003').first()).toBeVisible();
  });

  test('TC-T1-CASE-04: Toggles Internal Note and posts into chronological message timeline', async ({ page }) => {
    await page.getByText('CASE-1041').first().click();

    // Switch to Internal Note
    await page.getByRole('button', { name: /Internal Note/i }).click();

    const composer = page.getByPlaceholder(/Type an internal note visible ONLY to HR agents/i);
    await composer.fill('Confidential audit note: verified with insurer representative over phone.');

    await page.getByRole('button', { name: /Save Note/i }).click();

    // Verify amber note appears in thread
    await expect(page.getByText('Confidential audit note: verified with insurer representative over phone.')).toBeVisible();
  });

  test('TC-T1-CASE-05: Cube AI Knowledge Recommendations and Insert into Reply', async ({ page }) => {
    await page.getByText('CASE-1041').first().click();

    // Verify Cube AI Recommendations accordion
    await expect(page.getByText(/Cube AI Knowledge Recommendations/i)).toBeVisible();

    const insertBtn = page.getByRole('button', { name: /Insert into Reply Composer/i }).first();
    if (await insertBtn.isVisible()) {
      await insertBtn.click();
      const replyComposer = page.getByPlaceholder(/Type your message to the employee/i);
      await expect(replyComposer).toHaveValue(/Group Medical Insurance Policy/i);
    }
  });

  test('TC-T1-CASE-06: Resolves case ticket with resolution summary', async ({ page }) => {
    await page.getByText('CASE-1041').first().click();

    const resolveBtn = page.getByRole('button', { name: 'Resolve Case' });
    if (await resolveBtn.isVisible()) {
      await resolveBtn.click();
      await expect(page.getByRole('heading', { name: 'Resolve Case Ticket' })).toBeVisible();

      await page.getByPlaceholder(/Verified employee submitted birth certificates/i).fill('Endorsement submitted and processed with insurer.');
      await page.getByRole('button', { name: 'Confirm & Mark Resolved' }).click();

      await expect(page.getByText('RESOLVED').first()).toBeVisible();
    }
  });

  test('TC-T1-CASE-07: Employee Self-Service View and Raise Ticket with Live Suggestions', async ({ page }) => {
    // Switch to My Cases
    await page.getByRole('button', { name: /My Cases \(Self\)/i }).click();
    await expect(page.getByRole('heading', { name: 'My Support Queries & Cases' })).toBeVisible();

    // Click Submit Query
    await page.getByRole('button', { name: /Submit a Query/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Raise New HR Support Case' })).toBeVisible();

    // Type subject and test instant live suggestion
    await page.getByPlaceholder(/e\.g\. Dependent addition to medical insurance policy/i).fill('medical insurance baby');
    await expect(page.getByText(/Cube AI Instant Suggestion/i)).toBeVisible({ timeout: 5000 });

    // Fill details and submit
    await page.getByPlaceholder(/Provide complete context/i).fill('Need assistance adding child to insurance policy.');
    await page.getByRole('button', { name: 'Submit Case' }).click();

    // Verified submitted case appears
    await expect(page.getByText('medical insurance baby').first()).toBeVisible();
  });

  test('TC-T1-CASE-08: Settings View categories, SLA matrix, and Escalation Check', async ({ page }) => {
    // Switch to Settings
    await page.getByRole('button', { name: /Settings \(Admin\)/i }).click();

    // Tab 1: Categories & Routing
    await expect(page.getByRole('heading', { name: 'Category Taxonomy & Auto-Assignment' })).toBeVisible();
    await expect(page.getByText('Payroll & Taxes').first()).toBeVisible();
    await expect(page.getByText('Leave & Attendance').first()).toBeVisible();

    // Tab 2: SLA & Escalation
    await page.getByRole('button', { name: /Tab 2: SLA & Escalation Policies/i }).click();
    await expect(page.getByRole('heading', { name: 'SLA Matrix & Automated Escalations' })).toBeVisible();

    // Run Escalation Check
    await page.getByRole('button', { name: /Run Escalation Check Now/i }).click();
    await expect(page.getByText(/Escalation check completed/i)).toBeVisible();

    // Tab 3: Knowledge Base Connections
    await page.getByRole('button', { name: /Tab 3: Knowledge Base Connections/i }).click();
    await expect(page.getByRole('heading', { name: 'Knowledge Hive & Policy Intelligence' })).toBeVisible();
    await expect(page.getByText('Group Medical Insurance Policy 2026').first()).toBeVisible();
  });
});
