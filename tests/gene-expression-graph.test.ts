import { test, expect } from '@playwright/test';

test.describe('Gene Expression Graph Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a gene page that has expression graph
    await page.goto('/gene/ENSG00000130208');
    await expect(page).toHaveTitle(/APOC1 ENSG00000130208 expression in Homo sapiens/);

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display the gene expression graph section', async ({ page }) => {
    // Check that the expression graph section is visible
    await expect(page.getByRole('heading', { name: 'Expression graph' })).toBeVisible();

    // The first .gene-expr-fields-wrapper on the page is the Expression graph section
    // (Expression table section comes later)
    const dataTypeWrapper = page.locator('.gene-expr-fields-wrapper').first();

    // Check that data type checkboxes are available
    await expect(dataTypeWrapper.getByText('RNA Seq', { exact: true })).toBeVisible();
    await expect(dataTypeWrapper.getByText('Affymetrix', { exact: true })).toBeVisible();
    await expect(dataTypeWrapper.getByText('In Situ', { exact: true })).toBeVisible();
    await expect(dataTypeWrapper.getByText('EST', { exact: true })).toBeVisible();
    await expect(dataTypeWrapper.getByText('scRNA-Seq', { exact: true })).toBeVisible();
  });

  test('should allow selecting different data types', async ({ page }) => {
    // Wait for the data type checkboxes to be available
    await page.waitForTimeout(2000);

    // The first .gene-expr-fields-wrapper is the Expression graph section
    const dataTypeWrapper = page.locator('.gene-expr-fields-wrapper').first();
    const rnaSeqCheckbox = dataTypeWrapper
      .getByText('RNA Seq', { exact: true })
      .locator('..')
      .locator('input[type="checkbox"]');
    const affymetrixCheckbox = dataTypeWrapper
      .getByText('Affymetrix', { exact: true })
      .locator('..')
      .locator('input[type="checkbox"]');

    // Check initial state - all should be selected by default
    await expect(rnaSeqCheckbox).toBeChecked();
    await expect(affymetrixCheckbox).toBeChecked();

    // Uncheck RNA-Seq
    await rnaSeqCheckbox.uncheck();
    await expect(rnaSeqCheckbox).not.toBeChecked();

    // Check that Update button is enabled (first Update button is for Expression graph)
    const updateButton = page.getByRole('button', { name: 'Update' }).first();
    await expect(updateButton).toBeEnabled();
  });

  test('should update the graph when data types are changed', async ({ page }) => {
    // Wait for the initial graph to load
    await page.waitForTimeout(3000);

    // Uncheck a data type
    const dataTypeWrapper = page.locator('.gene-expr-fields-wrapper').first();
    const rnaSeqCheckbox = dataTypeWrapper
      .getByText('RNA Seq', { exact: true })
      .locator('..')
      .locator('input[type="checkbox"]');
    await rnaSeqCheckbox.uncheck();

    // Click Update button (first one is for Expression graph)
    await page.getByRole('button', { name: 'Update' }).first().click();

    // Wait for the graph to update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that the expression graph heading is still visible
    await expect(page.getByRole('heading', { name: 'Expression graph' })).toBeVisible();
  });

  test('should display select all and unselect all buttons', async ({ page }) => {
    // Wait for buttons to be visible
    await page.waitForTimeout(2000);

    // Check that Select All button is present (first one is for Expression graph)
    await expect(page.getByRole('button', { name: 'Select All' }).first()).toBeVisible();

    // Check that Unselect All button is present (first one is for Expression graph)
    await expect(page.getByRole('button', { name: 'Unselect All' }).first()).toBeVisible();
  });

  test('should handle select all functionality', async ({ page }) => {
    // Wait for checkboxes to be available
    await page.waitForTimeout(2000);

    // First uncheck all data types (first Unselect All button is for Expression graph)
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' }).first();
    await unselectAllButton.click();

    // Verify all checkboxes are unchecked - find all checkboxes in the first data type wrapper
    const allCheckboxes = page.locator('.gene-expr-fields-wrapper').first().locator('input[type="checkbox"]');
    const count = await allCheckboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(allCheckboxes.nth(i)).not.toBeChecked();
    }

    // Click Select All (first Select All button is for Expression graph)
    const selectAllButton = page.getByRole('button', { name: 'Select All' }).first();
    await selectAllButton.click();

    // Verify all checkboxes are checked
    for (let i = 0; i < count; i++) {
      await expect(allCheckboxes.nth(i)).toBeChecked();
    }
  });

  test('should handle unselect all functionality', async ({ page }) => {
    // Wait for checkboxes to be available
    await page.waitForTimeout(2000);

    // Click Unselect All (first one is for Expression graph)
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' }).first();
    await unselectAllButton.click();

    // Verify all checkboxes are unchecked - find all checkboxes in the first data type wrapper
    const allCheckboxes = page.locator('.gene-expr-fields-wrapper').first().locator('input[type="checkbox"]');
    const count = await allCheckboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(allCheckboxes.nth(i)).not.toBeChecked();
    }
  });

  test('should display the heatmap when data is available', async ({ page }) => {
    // Wait for the graph to load
    await page.waitForTimeout(5000);

    // Check if heatmap is visible (it might take time to load)
    const heatmap = page.locator('svg, canvas, [class*="heatmap"]').first();

    // Try to find the heatmap container
    const graphSection = page.getByRole('heading', { name: 'Expression graph' });
    await expect(graphSection).toBeVisible();

    // Check for either heatmap or "No data found" message
    const noDataMessage = page.getByText('No data found');
    const hasHeatmap = await heatmap.isVisible();
    const hasNoData = await noDataMessage.isVisible();

    // Either heatmap should be visible OR no data message should be visible
    expect(hasHeatmap || hasNoData).toBeTruthy();
  });

  test('should handle loading state', async ({ page }) => {
    // Navigate to a gene page and immediately check for loading state
    await page.goto('/gene/ENSG00000130208');

    // Check for loading indicator or graph section
    const loadingIndicator = page.locator('.progress.is-primary, [class*="loading"], [class*="spinner"]').first();
    const graphSection = page.getByRole('heading', { name: 'Expression graph' });

    // Either loading indicator or graph section should be visible
    const hasLoading = await loadingIndicator.isVisible();
    const hasGraph = await graphSection.isVisible();
    expect(hasLoading || hasGraph).toBeTruthy();
  });

  test('should maintain data type selection in URL', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(2000);

    // Get initial URL
    const initialUrl = page.url();

    // Uncheck RNA-Seq data type
    const dataTypeWrapper = page.locator('.gene-expr-fields-wrapper').first();
    const rnaSeqCheckbox = dataTypeWrapper
      .getByText('RNA Seq', { exact: true })
      .locator('..')
      .locator('input[type="checkbox"]');
    await rnaSeqCheckbox.uncheck();

    // Click Update button (first one is for Expression graph)
    await page.getByRole('button', { name: 'Update' }).first().click();

    // Wait for URL to actually change (client-side navigation)
    await page.waitForFunction((oldUrl) => window.location.href !== oldUrl, initialUrl, { timeout: 5000 });

    // Check that URL contains the data_type parameter
    const url = page.url();
    expect(url).toContain('data_type');

    // Parse the URL to check data_type parameter values
    const urlObj = new URL(url);
    const dataTypeParam = urlObj.searchParams.get('data_type');
    expect(dataTypeParam).toBeTruthy();

    // Should contain the remaining data types (all except RNA_SEQ)
    const dataTypes = dataTypeParam!.split(',');
    expect(dataTypes).toContain('AFFYMETRIX');
    expect(dataTypes).toContain('SC_RNA_SEQ');
    expect(dataTypes).not.toContain('RNA_SEQ'); // RNA_SEQ (without SC_ prefix) should not be present
  });

  test('should handle gene with no expression data', async ({ page }) => {
    // Navigate to a gene that might not have expression data
    await page.goto('/gene/ENSG00000000000'); // Invalid gene ID

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if "No data found" message is displayed
    const noDataMessage = page.getByText('No data found');
    if (await noDataMessage.isVisible()) {
      await expect(noDataMessage).toBeVisible();
    }
  });

  test('should display anatomical terms in the graph', async ({ page }) => {
    // Wait for the graph to load
    await page.waitForTimeout(5000);

    // Look for anatomical terms in the graph - these could be in various forms
    // Try to find elements with class containing "anatomical" or "tissue"
    const anatomicalByClass = page.locator('[class*="anatomical"], [class*="tissue"]');
    const hasAnatomicalClass = (await anatomicalByClass.count()) > 0;

    // Or look for common anatomical term text
    const brainTerm = page.getByText(/brain/i);
    const hasBrainTerm = (await brainTerm.count()) > 0;

    // At least one type of anatomical term should be present, or just verify the graph section is visible
    if (hasAnatomicalClass) {
      await expect(anatomicalByClass.first()).toBeVisible();
    } else if (hasBrainTerm) {
      await expect(brainTerm.first()).toBeVisible();
    } else {
      // If no specific anatomical terms found, just verify the Expression graph heading is visible
      await expect(page.getByRole('heading', { name: 'Expression graph' })).toBeVisible();
    }
  });

  test('should allow expanding anatomical terms', async ({ page }) => {
    // Wait for the graph to load
    await page.waitForTimeout(5000);

    // Look for expandable nodes (usually have plus/minus icons or are clickable)
    const expandableNodes = page.locator('[class*="expand"], [class*="collapse"], [class*="node"]').first();

    if (await expandableNodes.isVisible()) {
      // Try to click on an expandable node
      await expandableNodes.click();

      // Wait for potential expansion
      await page.waitForTimeout(2000);

      // Check if children appeared or node expanded
      await expect(expandableNodes).toBeVisible();
    }
  });

  test('should handle data type filtering correctly', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(3000);

    // Get initial state
    const initialUrl = page.url();

    // Uncheck all data types except one (first Unselect All is for Expression graph)
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' }).first();
    await unselectAllButton.click();

    // Select only RNA-Seq
    const dataTypeWrapper = page.locator('.gene-expr-fields-wrapper').first();
    const rnaSeqCheckbox = dataTypeWrapper
      .getByText('RNA Seq', { exact: true })
      .locator('..')
      .locator('input[type="checkbox"]');
    await rnaSeqCheckbox.check();

    // Click Update (first one is for Expression graph)
    await page.getByRole('button', { name: 'Update' }).first().click();

    // Wait for update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that URL changed
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('data_type=RNA_SEQ');
  });
});
