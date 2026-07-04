import { test, expect, Page } from '@playwright/test';

declare global {
  interface Window {
    monaco?: {
      editor?: {
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
    await page.locator('.monaco-editor').waitFor({ state: 'visible' });
  });

  async function clearAndPasteText(page: Page, text: string) {
    await page.evaluate((t) => {
      const editorModel = window.monaco?.editor?.getModels()[0];
      if (editorModel) {
        editorModel.setValue(t);
      }
    }, text.trim());
  }

  test('should auto-detect JSON format, validate it, and update status', async ({ page }) => {
    const validJson = JSON.stringify(
      {
        openapi: '3.0.0',
        info: { title: 'E2E Test API', version: '1.0.0' },
        paths: {},
      },
      null,
      2
    );

    await clearAndPasteText(page, validJson);

    const jsonButton = page.locator('button', { hasText: 'JSON' });
    await expect(jsonButton).toHaveAttribute('aria-pressed', 'true');

    const validStatus = page.getByTestId('editor-valid');
    await expect(validStatus).toBeVisible();
  });

  test('should auto-detect YAML format and show error for invalid schema', async ({ page }) => {
    const invalidYaml = [
      'openapi: "3.0.0"',
      'info:',
      '  title: "Invalid YAML API"',
      '  version: "1.0.0"',
    ].join('\n');

    await clearAndPasteText(page, invalidYaml);

    const yamlButton = page.locator('button', { hasText: 'YAML' });
    await expect(yamlButton).toHaveAttribute('aria-pressed', 'true');

    const errorStatus = page.getByTestId('editor-error');
    await expect(errorStatus).toBeVisible();
    await expect(errorStatus).toContainText(/(paths|коректность|correctness)/i);
  });

  test('should successfully toggle format via UI switch without breaking text', async ({
    page,
  }) => {
    const initialJson = JSON.stringify(
      {
        openapi: '3.0.0',
        info: { title: 'Switching API', version: '1.0.0' },
        paths: {},
      },
      null,
      2
    );

    await clearAndPasteText(page, initialJson);

    await expect(page.getByTestId('editor-valid')).toBeVisible();

    const yamlButton = page.locator('button', { hasText: 'YAML' });
    await yamlButton.click();

    await expect(yamlButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('editor-valid')).toBeVisible();

    const editorText = page.locator('.monaco-editor');
    await expect(editorText).toContainText('Switching API');
  });
});
