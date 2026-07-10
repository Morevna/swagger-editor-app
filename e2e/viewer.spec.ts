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

test.describe('Swagger Viewer E2E Tests', () => {
  const mockOpenApiSchema = JSON.stringify(
    {
      openapi: '3.0.0',
      info: { title: 'E2E Viewer Test API', version: '1.0.0' },
      servers: [{ url: 'https://example.com' }],
      paths: {
        '/users': {
          get: { summary: 'List all users' },
          post: { summary: 'Create a new user' },
        },
        '/posts': {
          get: { summary: 'List all posts' },
        },
      },
    },
    null,
    2
  );

  async function injectSchemaIntoEditor(page: Page, text: string) {
    await page.evaluate((t) => {
      const models = window.monaco?.editor?.getModels();
      const editorModel = models && models[0];
      if (editorModel) {
        editorModel.setValue(t);
      }
    }, text.trim());
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.locator('.monaco-editor').waitFor({ state: 'visible' });
    await injectSchemaIntoEditor(page, mockOpenApiSchema);
    await expect(page.getByTestId('editor-valid')).toBeVisible();
  });

  test('should render sidebar endpoints and display first endpoint details by default', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { name: '/users', level: 3 })).toBeVisible();

    const firstMethodButton = page.getByRole('button', { name: /get.*\/users/i });
    await expect(firstMethodButton).toBeVisible();

    const detailsContainer = page.getByTestId('endpoint-details');
    await expect(detailsContainer).toContainText('get');
    await expect(detailsContainer).toContainText('/users');
  });

  test('should switch endpoint details when clicking on another method', async ({ page }) => {
    const postMethodButton = page.getByRole('button', { name: /post.*\/users/i });
    await expect(postMethodButton).toBeVisible();
    await postMethodButton.click();

    await expect(postMethodButton).toHaveClass(/border-blue-500/);
    await expect(postMethodButton).toHaveClass(/bg-blue-50/);

    const detailsContainer = page.getByTestId('endpoint-details');
    await expect(detailsContainer).toContainText('post');
    await expect(detailsContainer).toContainText('/users');
  });

  test('should filter endpoint list via search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search|Поиск/i);
    await expect(searchInput).toBeVisible();

    await expect(page.getByRole('heading', { name: '/users', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: '/posts', level: 3 })).toBeVisible();

    await searchInput.fill('posts');
    await expect(page.getByRole('heading', { name: '/users', level: 3 })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: '/posts', level: 3 })).toBeVisible();
  });
});
