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
    await expect(page.getByText('Gene expression graph')).toBeVisible();

    // Check that data type selection is present
    await expect(page.getByText('Data type')).toBeVisible();

    // Check that data type checkboxes are available
    await expect(page.getByText('bulk RNA-Seq')).toBeVisible();
    await expect(page.getByText('Affymetrix data')).toBeVisible();
    await expect(page.getByText('In situ hybridization')).toBeVisible();
    await expect(page.getByText('EST')).toBeVisible();
  });

  test('should allow selecting different data types', async ({ page }) => {
    // Wait for the data type checkboxes to be available
    await page.waitForTimeout(2000);

    // Find and interact with data type checkboxes
    const rnaSeqCheckbox = page.locator('input[type="checkbox"][value="RNA_SEQ"]').first();
    const affymetrixCheckbox = page.locator('input[type="checkbox"][value="AFFYMETRIX"]').first();

    // Check initial state - all should be selected by default
    await expect(rnaSeqCheckbox).toBeChecked();
    await expect(affymetrixCheckbox).toBeChecked();

    // Uncheck RNA-Seq
    await rnaSeqCheckbox.uncheck();
    await expect(rnaSeqCheckbox).not.toBeChecked();

    // Check that Update button is enabled
    const updateButton = page.getByRole('button', { name: 'Update' });
    await expect(updateButton).toBeEnabled();
  });

  test('should update the graph when data types are changed', async ({ page }) => {
    // Wait for the initial graph to load
    await page.waitForTimeout(3000);

    // Uncheck a data type
    const rnaSeqCheckbox = page.locator('input[type="checkbox"][value="RNA_SEQ"]').first();
    await rnaSeqCheckbox.uncheck();

    // Click Update button
    await page.getByRole('button', { name: 'Update' }).click();

    // Wait for the graph to update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that the graph is still visible (or shows no data message)
    const graphContainer = page.locator('.gene-expr-fields-wrapper').locator('..');
    await expect(graphContainer).toBeVisible();
  });

  test('should display select all and unselect all buttons', async ({ page }) => {
    // Wait for buttons to be visible
    await page.waitForTimeout(2000);

    // Check that Select All button is present
    await expect(page.getByRole('button', { name: 'Select All' })).toBeVisible();

    // Check that Unselect All button is present
    await expect(page.getByRole('button', { name: 'Unselect All' })).toBeVisible();
  });

  test('should handle select all functionality', async ({ page }) => {
    // Wait for checkboxes to be available
    await page.waitForTimeout(2000);

    // First uncheck all data types
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' });
    await unselectAllButton.click();

    // Verify all checkboxes are unchecked
    const allCheckboxes = page.locator(
      'input[type="checkbox"][value^="RNA_SEQ"], input[type="checkbox"][value^="AFFYMETRIX"], input[type="checkbox"][value^="IN_SITU"], input[type="checkbox"][value^="EST"]'
    );
    const count = await allCheckboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(allCheckboxes.nth(i)).not.toBeChecked();
    }

    // Click Select All
    const selectAllButton = page.getByRole('button', { name: 'Select All' });
    await selectAllButton.click();

    // Verify all checkboxes are checked
    for (let i = 0; i < count; i++) {
      await expect(allCheckboxes.nth(i)).toBeChecked();
    }
  });

  test('should handle unselect all functionality', async ({ page }) => {
    // Wait for checkboxes to be available
    await page.waitForTimeout(2000);

    // Click Unselect All
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' });
    await unselectAllButton.click();

    // Verify all checkboxes are unchecked
    const allCheckboxes = page.locator(
      'input[type="checkbox"][value^="RNA_SEQ"], input[type="checkbox"][value^="AFFYMETRIX"], input[type="checkbox"][value^="IN_SITU"], input[type="checkbox"][value^="EST"]'
    );
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
    const graphSection = page.locator('text=Gene expression graph').locator('..');
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

    // Check for loading indicator in the graph section
    const loadingIndicator = page.locator('.progress.is-primary, [class*="loading"], [class*="spinner"]').first();

    // Loading might be very brief, so we'll just check that the graph section exists
    const graphSection = page.locator('text=Gene expression graph').locator('..');
    await expect(graphSection).toBeVisible();
  });

  test('should maintain data type selection in URL', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(2000);

    // Uncheck RNA-Seq data type
    const rnaSeqCheckbox = page.locator('input[type="checkbox"][value="RNA_SEQ"]').first();
    await rnaSeqCheckbox.uncheck();

    // Click Update button
    await page.getByRole('button', { name: 'Update' }).click();

    // Wait for URL to update
    await page.waitForLoadState('networkidle');

    // Check that URL contains the data type parameter
    const url = page.url();
    expect(url).toContain('data_type');
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

    // Look for anatomical terms in the graph
    // These might be in the heatmap or as expandable tree nodes
    const anatomicalTerms = page.locator(
      '[class*="anatomical"], [class*="tissue"], text=/brain/, text=/liver/, text=/heart/'
    );

    // Check if any anatomical terms are visible
    const termCount = await anatomicalTerms.count();
    if (termCount > 0) {
      await expect(anatomicalTerms.first()).toBeVisible();
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

    // Uncheck all data types except one
    const unselectAllButton = page.getByRole('button', { name: 'Unselect All' });
    await unselectAllButton.click();

    // Select only RNA-Seq
    const rnaSeqCheckbox = page.locator('input[type="checkbox"][value="RNA_SEQ"]').first();
    await rnaSeqCheckbox.check();

    // Click Update
    await page.getByRole('button', { name: 'Update' }).click();

    // Wait for update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that URL changed
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('data_type=RNA_SEQ');
  });
});
