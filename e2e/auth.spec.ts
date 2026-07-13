import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser } from './helpers/supabase-admin';

const testEmail = `e2e-test-${Date.now()}@test.com`;
const testPassword = 'Test!100';

test.describe(() => {
  test.beforeAll(async () => {
    await createTestUser(testEmail, testPassword);
  });

  test.afterAll(async () => {
    await deleteTestUser(testEmail);
  });

  test('sign in, navigation, sign out (happy path)', async ({ page }) => {
    await page.goto('/');

    await Promise.all([
      page.getByRole('link', { name: /sign.?in/i }).click(),
      page.waitForURL('/en/sign-in'),
    ]);

    await page.locator('#email-input').fill(testEmail);
    await page.locator('#password-input').fill(testPassword);
    await Promise.all([
      page.getByRole('button', { name: /sign.?in/i }).click(),
      page.waitForURL('/en'),
    ]);

    await page.goto('/en/sign-in');
    await expect(page).toHaveURL('/en');

    await page.goto('/en/sign-up');
    await expect(page).toHaveURL('/en');

    await Promise.all([
      page.getByRole('link', { name: /history/i }).click(),
      page.waitForURL('/en/history'),
    ]);

    await page.reload();
    await expect(page).toHaveURL('/en/history');

    await Promise.all([
      page.getByRole('button', { name: /sign.?out/i }).click(),
      page.waitForURL('/en'),
    ]);

    await page.goto('/en/history');
    await expect(page).toHaveURL('/en');
  });

  test('invalid credentials', async ({ page }) => {
    await page.goto('/en/sign-in');

    await page.locator('#email-input').fill(testEmail);
    await page.locator('#password-input').fill('Wrong!100');
    await page.getByRole('button', { name: /sign.?in/i }).click();

    await expect(page).toHaveURL('/en/sign-in');
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
