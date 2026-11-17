import { test, expect } from '@playwright/test';

test.describe('Tier 4: Real-World Multi-Persona Workflows', () => {
  test('TC-T4-E2E-01: End-to-End Hire-to-Retire Multi-Module Journey', async ({ page }) => {
    // Step 1: Overview Dashboard
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Core HR & Employee Management' })).toBeVisible();

    // Step 2: Onboarding - Invite Candidate
    await page.getByRole('link', { name: '1. Onboarding' }).click();
    await page.getByRole('button', { name: 'Invite Candidate' }).click();
    await page.getByPlaceholder('e.g. Arjun').fill('Aditya');
    await page.getByPlaceholder('e.g. Reddy').fill('Nair');
    await page.getByPlaceholder('arjun.reddy@example.com').fill('aditya.nair@example.com');
    await page.getByRole('button', { name: 'Send Invitation' }).click();
    await expect(page.getByText('Aditya Nair')).toBeVisible();

    // Step 3: Employee Directory & Org Chart
    await page.getByRole('link', { name: '2. Employee DBMS & Org' }).click();
    await expect(page.getByText('David Miller')).toBeVisible();
    await page.getByRole('button', { name: 'Org Tree' }).click();
    await expect(page.getByText('ROOT LEVEL • CEO')).toBeVisible();

    // Step 4: Employee Self-Service
    await page.getByRole('link', { name: '3. Employee Self-Service' }).click();
    await expect(page.getByText('John Doe')).toBeVisible();

    // Step 5: HR Help Desk
    await page.getByRole('link', { name: '4. HR Help Desk & Cases' }).click();
    await expect(page.getByText('CASE-2026-0001')).toBeVisible();

    // Step 6: Documents & Compliance
    await page.getByRole('link', { name: '5. Documents & Compliance' }).click();
    await expect(page.getByText('Information Security & Data Protection Policy')).toBeVisible();

    // Step 7: Offboarding
    await page.getByRole('link', { name: '6. Offboarding & Exits' }).click();
    await expect(page.getByText('Offboarding & Exit Management')).toBeVisible();
  });

  test('TC-T4-E2E-02: Compliance Blitz & Digital Consent Rollout', async ({ page }) => {
    await page.goto('/documents');
    await expect(page.getByRole('heading', { name: 'Document Management & Compliance' })).toBeVisible();

    const ackBtn = page.getByRole('button', { name: 'Read & Acknowledge Policy' }).first();
    if (await ackBtn.isVisible()) {
      await ackBtn.click();
      await page.getByRole('button', { name: 'I Agree & Acknowledge' }).click();
      await expect(page.getByText('Acknowledged').first()).toBeVisible();
    }
  });
});
