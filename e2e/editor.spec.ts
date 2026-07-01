import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    monaco?: {
      editor: {
        getModels: () => Array<{
          setValue: (value: string) => void;
        }>;
      };
    };
  }
}

test.describe('Swagger Editor E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.monaco-editor', { state: 'visible' });
  });

  test('should render default JSON schema successfully', async ({ page }) => {
    await expect(page.getByText('Editor', { exact: true })).toBeVisible();

    const jsonButton = page.getByRole('button', { name: 'JSON', exact: true });

    await expect(jsonButton).toHaveClass(/bg-white/);

    await expect(page.getByTestId('editor-error')).not.toBeVisible();

    await expect(page.getByTestId('editor-valid')).toBeVisible();
  });

  test('should allow manual code editing and preserve valid status', async ({ page }) => {
    const validJson = JSON.stringify(
      {
        openapi: '3.0.0',
        info: { title: 'Updated API', version: '2.0.0' },
        paths: {},
      },
      null,
      2
    );

    await page.evaluate((text) => {
      const models = window.monaco?.editor?.getModels();

      if (models && models.length > 0) {
        models[0].setValue(text);
      }
    }, validJson);

    await expect(page.getByTestId('editor-error')).not.toBeVisible();
    await expect(page.getByTestId('editor-valid')).toBeVisible();
  });

  test('should switch format to YAML and back via header buttons', async ({ page }) => {
    await page.getByRole('button', { name: 'YAML', exact: true }).click();
    await expect(page.getByRole('button', { name: 'YAML', exact: true })).toHaveClass(/bg-white/);

    await page.getByRole('button', { name: 'JSON', exact: true }).click();
    await expect(page.getByRole('button', { name: 'JSON', exact: true })).toHaveClass(/bg-white/);
  });

  test('should auto-detect format when raw YAML text is pasted', async ({ page }) => {
    const rawYaml = `openapi: 3.0.0
info:
  title: Lazy Loaded YAML API
  version: 1.1.0
paths: {}`;

    await page.evaluate((text) => {
      const models = window.monaco?.editor?.getModels();
      if (models && models.length > 0) {
        models[0].setValue(text);
      }
    }, rawYaml);

    await page.locator('.monaco-editor').click();
    await expect(page.getByRole('button', { name: 'YAML', exact: true })).toHaveClass(/bg-white/);
  });
});
