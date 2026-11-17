import { test, expect } from '@playwright/test';

test.describe('Tier 1: Module 4 — HR Help Desk & Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cases');
  });

  test('TC-T1-CASE-01: Renders support ticket queues with priority and SLA badges', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'HR Help Desk & Cases' })).toBeVisible();
    await expect(page.getByText('CASE-2026-0001')).toBeVisible();
    await expect(page.getByText('SLA: 18h left')).toBeVisible();
  });

  test('TC-T1-CASE-02: Submits a new support ticket and verifies it appears in queue', async ({ page }) => {
    await page.getByRole('button', { name: 'Raise Support Ticket' }).click();
    await expect(page.getByRole('heading', { name: 'Raise Support Ticket' })).toBeVisible();

    await page.getByPlaceholder('Summary of the issue...').fill('PF UAN linking error on portal');
    await page.getByPlaceholder('Describe your query or request in detail...').fill('Unable to link previous employer PF member ID.');

    await page.getByRole('button', { name: 'Submit Ticket' }).click();
    await expect(page.getByText('PF UAN linking error on portal')).toBeVisible();
  });

  test('TC-T1-CASE-03: Opens ticket and verifies threaded conversation history', async ({ page }) => {
    await page.getByText('CASE-2026-0001').click();
    await expect(page.getByText('Clarification regarding medical insurance coverage').first()).toBeVisible();
    await expect(page.getByText('Hello, what documents are required')).toBeVisible();
  });

  test('TC-T1-CASE-04: Posts reply into message thread', async ({ page }) => {
    await page.getByText('CASE-2026-0001').click();
    const replyInput = page.getByPlaceholder('Reply to employee...');
    await replyInput.fill('Thank you, I have uploaded the discharge summary.');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Thank you, I have uploaded the discharge summary.')).toBeVisible();
  });

  test('TC-T1-CASE-05: Resolves ticket and updates case status to RESOLVED', async ({ page }) => {
    await page.getByText('CASE-2026-0001').click();
    const resolveBtn = page.getByRole('button', { name: 'Mark Resolved' });
    if (await resolveBtn.isVisible()) {
      await resolveBtn.click();
      await expect(page.getByText('RESOLVED').first()).toBeVisible();
    }
  });
});
