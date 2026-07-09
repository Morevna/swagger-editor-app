import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');

  await Promise.all([
    page.getByRole('link', { name: /sign.?in/i }).click(),
    page.waitForURL('/en/sign-in'),
  ]);

  await page.locator('#email-input').fill(email);
  await page.locator('#password-input').fill(password);
  await Promise.all([
    page.getByRole('button', { name: /sign.?in/i }).click(),
    page.waitForURL('/en'),
  ]);
}
