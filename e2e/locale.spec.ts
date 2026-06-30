import { test, expect } from '@playwright/test';

test.describe('Language switcher', () => {
  test('renders a locale selector with supported locales', async ({ page }) => {
    await page.goto('/');

    const switcher = page.getByRole('combobox');
    await expect(switcher).toBeVisible();

    await switcher.click();

    await expect(page.getByRole('option', { name: 'EN' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'RU' })).toBeVisible();
  });

  test('switching from EN to RU updates the URL', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('combobox').click();

    await page.getByRole('option', { name: 'RU' }).click();

    await expect(page).toHaveURL(/\/ru/);
  });

  test('RU locale is reflected as selected after switch', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'RU' }).click();

    await page.waitForURL(/\/ru/);

    const switcher = page.getByRole('combobox');
    await expect(switcher).toHaveText(/RU/i);
  });
});
