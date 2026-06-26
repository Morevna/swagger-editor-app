import { test, expect } from '@playwright/test';

test.describe('Language switcher', () => {
  test('renders a locale selector with supported locales', async ({ page }) => {
    await page.goto('/');

    const switcher = page.getByRole('combobox');
    await expect(switcher).toBeVisible();

    await expect(switcher.getByRole('option', { name: 'EN' })).toBeAttached();
    await expect(switcher.getByRole('option', { name: 'RU' })).toBeAttached();
  });

  test('switching from EN to RU updates the URL', async ({ page }) => {
    await page.goto('/en');

    const switcher = page.getByRole('combobox');
    await switcher.selectOption('ru');

    await expect(page).toHaveURL(/\/ru/);
  });

  test('RU locale is reflected as selected after switch', async ({ page }) => {
    await page.goto('/en');

    const switcher = page.getByRole('combobox');
    await switcher.selectOption('ru');

    await page.waitForURL(/\/ru/);
    await expect(switcher).toHaveValue('ru');
  });
});
