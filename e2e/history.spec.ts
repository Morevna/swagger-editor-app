import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser } from './helpers/supabase-admin';
import { login } from './helpers/login';

let testEmail: string;
const testPassword = 'Test!100';

test.describe('History % Analytics E2E Tests', () => {
  test.beforeAll(async () => {
    testEmail = `e2e-test-${Date.now()}-${Math.floor(Math.random() * 1000)}@test.com`;
    await createTestUser(testEmail, testPassword);
  });

  test.afterAll(async () => {
    await deleteTestUser(testEmail);
  });

  test('empty table path', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await Promise.all([
      page.getByRole('link', { name: /history/i }).click(),
      page.waitForURL('/en/history'),
    ]);

    await expect(page.getByTestId('skeleton-table')).toBeHidden();

    const historyRows = page.getByTestId('table-row');
    await expect(historyRows).toHaveCount(0);

    await expect(page.getByTestId('empty-button')).toBeVisible();

    await Promise.all([page.getByTestId('empty-button').click(), page.waitForURL('/en')]);
  });
});
