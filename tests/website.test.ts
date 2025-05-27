import { test, expect } from '@playwright/test';

test.describe('Items pages', () => {
  test('display a gene', async ({ page }) => {
    await page.goto('/gene/ENSG00000130208');
    await expect(page).toHaveTitle(/APOC1 ENSG00000130208 expression in Homo sapiens \(human\)/);
    expect(await page.locator('text=apolipoprotein').count()).toBeGreaterThan(0);
  });

  test('display a species', async ({ page }) => {
    await page.goto('/species/9606');
    await expect(page).toHaveTitle(/Homo sapiens/);
    await expect(page.getByText('All genes for Homo sapiens genome version')).toBeVisible();
  });

  test('display an experiment', async ({ page }) => {
    await page.goto('/experiment/DRP000415');
    await expect(page).toHaveTitle(/Canis lupus familiaris/);
    await expect(page.getByText('Transcriptomes of the heart left ventricle muscles')).toBeVisible();
  });
});

// TODO: list of gene per species

test.describe('Search pages', () => {
  test('search a gene', async ({ page }) => {
    await page.goto('/search/genes');
    await expect(page).toHaveTitle(/Gene search/);
    expect(await page.getByText('ENSG00000130208').count()).toBe(0);
    // Search for a gene
    const searchInput = page.getByPlaceholder('Examples: dlx, ENSG00000254647');
    await searchInput.fill('Apoc1');
    await searchInput.press('Enter');
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
    // NOTE: Sometimes it happens that the assert below are timing out with chromium or webkit, even when waiting 10s
    await expect(page.getByText('ENSG00000130208').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('APOC1').first()).toBeVisible();
  });

  test('search raw data', async ({ page }) => {
    await page.goto('/search/raw-data');
    await expect(page).toHaveTitle(/Raw data/);
    await expect(page.getByText('DRP000415').first()).toBeVisible();
    // expect(await page.locator('text=DRP000415').count()).toBeGreaterThan(0);
  });

  test('search expression calls', async ({ page }) => {
    await page.goto('/search/expression-calls');
    await expect(page).toHaveTitle(/Present\/absent expression calls/);
    await page.waitForTimeout(3000);
    expect(await page.locator('text=WBGene00000001').count()).toBeGreaterThan(0);
  });

  test('display anatomical homology', async ({ page }) => {
    await page.goto('/search/anatomical-homology');
    await expect(page).toHaveTitle(/Anatomical homology search/);
    // expect(await page.locator('text=Mus musculus').count()).toBeGreaterThan(0);
    await expect(page.getByText('Mus musculus')).toBeVisible();
  });

  test('display expression comparison', async ({ page }) => {
    await page.goto('/analysis/expr-comparison');
    await expect(page).toHaveTitle(/Expression comparison analysis/);
    await expect(page.getByText('Compare expression of several genes.')).toBeVisible();
  });
});

test.describe('Other pages', () => {
  // test.beforeEach(async ({ page }) => {
  //   await page.goto('/');
  // });

  test('display home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bgee/);
    expect(await page.locator('text=Drosophila melanogaster').count()).toBeGreaterThan(0);
  });

  test('display markdown page', async ({ page }) => {
    await page.goto('/support/tutorial-data-curation');
    await expect(page).toHaveTitle(/Bgee data curation/);
    await expect(page.getByText('We use a few different methods for identifying experiments')).toBeVisible();
  });

  test('display static page', async ({ page }) => {
    await page.goto('/resources/annotations');
    await expect(page).toHaveTitle(/Annotation resources/);
    await expect(page.getByText('GTEx cleaning for Bgee')).toBeVisible();
  });
});

/*
- Check if present in page (dont check if visible)
expect(await page.locator('text=WBGene00000001').count()).toBeGreaterThan(0);
- Check if first one is visible
await expect(page.locator('text=WBGene00000001').first()).toBeVisible();
- Check if only one visible
await expect(page.getByText('WBGene00000001')).toBeVisible();
*/
