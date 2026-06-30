import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  const editorCount = await page.getByText(/editor/i).count();
  expect(editorCount).toBeGreaterThan(0);
});
