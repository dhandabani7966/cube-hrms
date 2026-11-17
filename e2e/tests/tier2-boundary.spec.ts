import { test, expect } from '@playwright/test';

test.describe('Tier 2: Boundary & Corner Cases', () => {
  test('TC-T2-BND-01: Non-existent employee search query gracefully renders 0 results', async ({ page }) => {
    await page.goto('/employees');
    const searchInput = page.getByPlaceholder('Search by name, ID or email...');
    await searchInput.fill('NonExistentEmployee99999');
    await expect(page.getByText('David Miller')).not.toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
  });

  test('TC-T2-BND-02: Form validation on Invite Candidate prevents submission with empty required fields', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Invite Candidate' }).click();

    // Attempt submitting without filling required fields
    const submitBtn = page.getByRole('button', { name: 'Send Invitation' });
    await submitBtn.click();

    // Modal remains open because HTML5 required attribute blocks submission
    await expect(page.getByText('Invite Candidate to Onboard')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('TC-T2-BND-03: Statutory notice period information displays correctly on resignation modal', async ({ page }) => {
    await page.goto('/offboarding');
    await page.getByRole('button', { name: 'Submit Resignation' }).click();
    await expect(page.getByText('Statutory notice period per contract: 30 calendar days.')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });
});
