import { test, expect } from '@playwright/test';

const url = 'http://localhost:5173';

test.describe('Check home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('species are loaded', async ({ page }) => {
    await expect(page).toHaveTitle(/Bgee/);
    await expect(page.locator('.home-cards').getByText('Drosophila melanogaster')).toBeVisible();
  });
});

test.describe('Check search genes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${url}/search/genes`);
  });

  test('searching a gene', async ({ page }) => {
    await expect(page).toHaveTitle(/Gene search/);
    await expect(page.locator('body').getByText('ENSG00000130208')).toBeHidden();
    // Search for a gene
    const searchInput = page.getByPlaceholder('Examples: dlx, ENSG00000254647');
    await searchInput.fill('Apoc1');
    await searchInput.press('Enter');
    await page.waitForTimeout(500);
    await expect(page.locator('body').getByText('ENSG00000130208')).toBeVisible();
  });
});

test.describe('Check gene page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${url}/gene/ENSG00000130208`);
  });

  test('showing a gene page', async ({ page }) => {
    await expect(page).toHaveTitle(/APOC1 expression in human/);
    await expect(page.locator('body').getByText('apolipoprotein')).toBeVisible();
  });
});
