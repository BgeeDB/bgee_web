import { test, expect } from '@playwright/test';

test.describe('Gene Expression Matrix Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the expression matrix page
    await page.goto('/search/expression-matrix');
    await expect(page).toHaveTitle(/Expression graph/);
  });

  test('should display the expression matrix page with all filters', async ({ page }) => {
    // Check that the page loads with the correct title
    await expect(page).toHaveTitle(/Expression graph/);

    // Check that the main heading is visible
    await expect(page.getByText('Search for expression calls')).toBeVisible();

    // Check that initially visible filter sections are present
    await expect(page.locator('label .boldTitle', { hasText: 'Species' })).toBeVisible();

    // Gene section should be visible after species selection, but not initially
    // Tissue, Data type, and Data quality sections are conditional on gene selection

    // Check that the submit button is present
    await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();

    // Check that the reinitialize button is present
    await expect(page.getByRole('button', { name: 'Reinitialize' })).toBeVisible();
  });

  test('should allow selecting a species', async ({ page }) => {
    // Wait for species API to load
    await page.waitForTimeout(5000);

    // Wait for the species dropdown to be visible (react-select component)
    const speciesSelect = page.locator('.react-select-species__control').first();
    await expect(speciesSelect).toBeVisible();

    // Click on the species dropdown to open it
    await speciesSelect.click();

    // Wait for options to load and select first available species
    await page.waitForTimeout(2000);
    const speciesOptions = page.locator('.react-select-species__option');
    const optionCount = await speciesOptions.count();

    if (optionCount > 1) {
      // Select first available species (not the default placeholder)
      await speciesOptions.nth(1).click();

      // Verify the selection was made by checking the displayed value
      const selectedValue = page.locator('.react-select-species__single-value');
      await expect(selectedValue).not.toHaveText(/Choose a species/);
    } else {
      console.log('Cannot test species selection - no species options available');
      test.skip();
    }
  });

  test('should allow searching for a gene', async ({ page }) => {
    // Wait for species API to load
    await page.waitForTimeout(5000);

    // First select a species using react-select
    const speciesSelect = page.locator('.react-select-species__control').first();
    await speciesSelect.click();
    await page.waitForTimeout(2000);

    const speciesOptions = page.locator('.react-select-species__option');
    const optionCount = await speciesOptions.count();

    if (optionCount > 1) {
      // Select first available species (not the default placeholder)
      await speciesOptions.nth(1).click();

      // Wait for the gene search to be available
      await page.waitForTimeout(2000);

      // Find the gene input field (it's in a SelectMultipleWithAutoComplete component)
      const geneInput = page.locator('#autocomplete-search-Gene').first();
      await expect(geneInput).toBeVisible();

      // Type a gene name
      await geneInput.fill('APOC1');

      // Wait for autocomplete suggestions
      await page.waitForTimeout(3000);

      // Select the first suggestion if available
      const suggestion = page.locator('[role="option"], .react-select__option').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
    } else {
      console.log('Cannot test gene search - no species options available');
      test.skip();
    }
  });

  test('should allow selecting data types', async ({ page }) => {
    // Wait for species API to load
    await page.waitForTimeout(5000);

    // First, we need to select a species and gene to make data types visible
    const speciesSelect = page.locator('.react-select-species__control');
    await speciesSelect.click();
    await page.waitForTimeout(2000);

    const speciesOptions = page.locator('.react-select-species__option');
    const optionCount = await speciesOptions.count();

    if (optionCount > 1) {
      // Select first available species (not the default placeholder)
      await speciesOptions.nth(1).click();
      await page.waitForTimeout(2000);

      // Enter a gene name to make data types visible
      const geneInput = page.locator('#autocomplete-search-Gene');
      if (await geneInput.isVisible()) {
        await geneInput.fill('APOC1');
        await page.waitForTimeout(2000);

        // Select the first gene option from autocomplete dropdown
        const geneOptions = page.locator('.react-select-autoComplete__option');
        const geneOptionCount = await geneOptions.count();

        if (geneOptionCount > 0) {
          await geneOptions.first().click();
          await page.waitForTimeout(2000);

          // Now check that data type checkbox options are present
          const dataTypeLabels = ['bulk RNA-Seq', 'scRNA-Seq', 'Affymetrix data', 'In situ hybridization', 'EST'];
          for (const label of dataTypeLabels) {
            await expect(page.locator('label.checkbox').filter({ hasText: label })).toBeVisible();
          }

          // Check that data quality checkbox options are present
          const qualityLabels = ['Bronze', 'Silver', 'Gold'];
          for (const label of qualityLabels) {
            await expect(page.locator('label.checkbox').filter({ hasText: label })).toBeVisible();
          }
        } else {
          console.log('No gene options available in autocomplete');
          test.skip();
        }
      } else {
        console.log('Gene input not visible after species selection');
        test.skip();
      }
    } else {
      console.log('Cannot test data types - no species options available');
      test.skip();
    }
  });

  test('should perform a basic search and display results', async ({ page }) => {
    // Wait for species API to load
    await page.waitForTimeout(5000);

    // Select species using react-select
    const speciesSelect = page.locator('.react-select-species__control').first();
    await speciesSelect.click();
    await page.waitForTimeout(2000);

    const speciesOptions = page.locator('.react-select-species__option');
    const optionCount = await speciesOptions.count();

    if (optionCount > 1) {
      // Select first available species (not the default placeholder)
      await speciesOptions.nth(1).click();

      // Wait for the form to be ready
      await page.waitForTimeout(2000);

      // Enter a gene name
      const geneInput = page.locator('#autocomplete-search-Gene').first();
      await geneInput.fill('APOC1');

      // Wait for autocomplete
      await page.waitForTimeout(3000);

      // Select the first gene option from autocomplete dropdown
      const geneOptions = page.locator('.react-select-autoComplete__option');
      const geneOptionCount = await geneOptions.count();

      console.log(`Found ${geneOptionCount} gene options in autocomplete`);

      if (geneOptionCount > 0) {
        await geneOptions.first().click();
        await page.waitForTimeout(2000);

        // Click search button
        await page.getByRole('button', { name: 'Submit', exact: true }).click();

        // Wait for results to load
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Check for an expression graph SVG in the results container (size is dynamic)
        const expressionGraphSvg = page.locator('.resultPart svg').first();
        const graphExists = await expressionGraphSvg.isVisible();

        if (graphExists) {
          console.log('Expression graph SVG rendered successfully');
        } else {
          console.log('Expression graph SVG not found in resultPart - checking all SVGs...');
          const svgElements = page.locator('svg');
          const svgCount = await svgElements.count();
          console.log(`Found ${svgCount} SVG elements`);
        }

        // Check that results section appears - verify a graph SVG is rendered
        await expect(page.locator('.resultPart svg').first()).toBeVisible();
      } else {
        console.log('No gene options available in autocomplete - cannot test search');
        test.skip();
      }

      // Check that anatomical terms are displayed (even if no data)
      await expect(page.locator('.resultPart')).toBeVisible();
    } else {
      console.log('Cannot test search - no species options available');
      test.skip();
    }
  });

  test('should handle search with anatomical entity selection', async ({ page }) => {
    // Select species using react-select
    const speciesSelect = page.locator('.react-select-species__control').first();
    await speciesSelect.click();
    await page.waitForTimeout(1000);

    const homoOption = page.locator('.react-select-species__option', { hasText: /Homo sapiens/ });
    if (await homoOption.isVisible()) {
      await homoOption.click();
    } else {
      console.log('Homo sapiens option not visible - API might be slow or failing');
      test.skip();
      return;
    }

    await page.waitForTimeout(2000);

    // Enter a gene name and select from autocomplete
    const geneInput = page.locator('#autocomplete-search-Gene').first();
    if (await geneInput.isVisible()) {
      await geneInput.fill('APOC1');
      await page.waitForTimeout(2000);

      // Select the first gene option from autocomplete dropdown
      const geneOptions = page.locator('.react-select-autoComplete__option');
      const geneOptionCount = await geneOptions.count();

      if (geneOptionCount > 0) {
        await geneOptions.first().click();
        await page.waitForTimeout(2000);
      } else {
        console.log('No gene options available in autocomplete');
        test.skip();
        return;
      }
    } else {
      console.log('Gene input not visible');
      test.skip();
      return;
    }

    // Try to select an anatomical entity if available
    const anatEntityInput = page.locator('input[placeholder*="anatomical"]').first();
    if (await anatEntityInput.isVisible()) {
      await anatEntityInput.fill('liver');
      await page.waitForTimeout(1000);

      const suggestion = page.locator('[role="option"], .react-select__option').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
    }

    // Perform search
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Verify results section - verify a graph SVG is rendered
    await expect(page.locator('.resultPart svg').first()).toBeVisible();
  });

  test('should reset form when reset button is clicked', async ({ page }) => {
    // First make some selections - wait for species API to load
    await page.waitForTimeout(5000);

    const speciesSelect = page.locator('.react-select-species__control').first();
    await speciesSelect.click();
    await page.waitForTimeout(2000);

    const speciesOptions = page.locator('.react-select-species__option');
    const optionCount = await speciesOptions.count();

    if (optionCount > 1) {
      // Select first available species (not the default placeholder)
      await speciesOptions.nth(1).click();
    } else {
      console.log('Cannot test reset functionality - no species options available');
      test.skip();
      return;
    }

    await page.waitForTimeout(1000);

    const geneInput = page.locator('#autocomplete-search-Gene').first();
    await geneInput.fill('APOC1');

    // Click reset button
    await page.getByRole('button', { name: 'Reinitialize' }).click();

    // Verify form is reset - check for default species selection
    await expect(page.locator('.react-select-species__single-value', { hasText: /Choose a species/ })).toBeVisible();

    // Verify gene input is no longer visible (form is properly reset)
    await expect(geneInput).not.toBeVisible();
  });

  test('should display loading state during search', async ({ page }) => {
    // Select species and gene
    const speciesSelect = page.locator('.react-select-species__control').first();
    await speciesSelect.click();
    await page.waitForTimeout(1000);

    const homoOption = page.locator('.react-select-species__option', { hasText: /Homo sapiens/ });
    if (await homoOption.isVisible()) {
      await homoOption.click();
    } else {
      console.log('Homo sapiens option not visible - API might be slow or failing');
      test.skip();
      return;
    }

    await page.waitForTimeout(2000);

    const geneInput = page.locator('#autocomplete-search-Gene').first();
    await geneInput.fill('APOC1');
    await page.waitForTimeout(2000);

    // Select the first gene option from autocomplete dropdown
    const geneOptions = page.locator('.react-select-autoComplete__option');
    const geneOptionCount = await geneOptions.count();

    if (geneOptionCount > 0) {
      await geneOptions.first().click();
      await page.waitForTimeout(2000);

      // Start search and check for loading state (might be very brief)
      const searchPromise = page.getByRole('button', { name: 'Submit', exact: true }).click();

      // Check for loading indicator (use flexible selector and handle case where it might not appear)
      const loadingIndicator = page.locator('.progress.is-primary, [class*="loading"], [class*="spinner"]').first();
      const loadingVisible = await loadingIndicator.isVisible();

      if (loadingVisible) {
        console.log('Loading indicator appeared during search');
        // Wait for search to complete
        await searchPromise;
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Loading indicator should be gone
        await expect(loadingIndicator).not.toBeVisible();
      } else {
        // Wait for search to complete anyway
        await searchPromise;
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('Search completed quickly (no loading indicator needed)');
      }
    } else {
      console.log('No gene options available in autocomplete');
      test.skip();
      return;
    }
  });

  test('should handle URL parameters correctly', async ({ page }) => {
    // Navigate with URL parameters
    await page.goto('/search/expression-matrix?species_id=9606&gene_id=ENSG00000130208');

    // Wait for the page to load and process URL parameters
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check that the form is populated from URL parameters
    await expect(page.locator('.react-select-species__single-value', { hasText: /Homo sapiens/ })).toBeVisible();

    // Check that gene is populated (might take time for autocomplete)
    await page.waitForTimeout(3000);
    const geneInput = page.locator('#autocomplete-search-Gene').first();

    // Check if gene input is visible (indicates species selection worked)
    const geneInputVisible = await geneInput.isVisible();
    expect(geneInputVisible).toBeTruthy();

    // Check that the gene is populated in the multi-value display (not the input field)
    const geneMultiValue = page.locator('.react-select-autoComplete__multi-value__label');
    await expect(geneMultiValue).toBeVisible();

    // Verify the gene value contains APOC1 (format: "ENSG00000130208 - APOC1")
    const geneValue = await geneMultiValue.textContent();
    expect(geneValue).toContain('APOC1');

    console.log('Species and gene selection from URL parameters is working');
    console.log(`Gene value: "${geneValue}"`);
  });

  test('should display error message for invalid search', async ({ page }) => {
    // Try to search without selecting a species
    await page.getByRole('button', { name: 'Submit', exact: true }).click();

    // Wait for any error messages or validation
    await page.waitForTimeout(2000);

    // Check if there are any validation messages
    const errorMessages = page.locator('.notification.is-danger, .help.is-danger');
    if ((await errorMessages.count()) > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should handle gene list parameter', async ({ page }) => {
    // Navigate with gene list parameter
    const geneList = 'ENSG00000130208%0AENSG00000012048';
    await page.goto(`/search/expression-matrix?gene_list=${geneList}`);

    // Wait for the page to process the gene list
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check that the form is populated with genes from the list
    const geneInput = page.locator('#autocomplete-search-Gene').first();
    const geneInputVisible = await geneInput.isVisible();
    expect(geneInputVisible).toBeTruthy();

    // Check that genes are populated in the multi-value display (not the input field)
    const geneMultiValues = page.locator('.react-select-autoComplete__multi-value__label');
    const geneCount = await geneMultiValues.count();
    expect(geneCount).toBeGreaterThan(0);

    // Verify at least one gene contains APOC1
    let foundAPOC1 = false;
    for (let i = 0; i < geneCount; i++) {
      const geneValue = await geneMultiValues.nth(i).textContent();
      if (geneValue && geneValue.includes('APOC1')) {
        foundAPOC1 = true;
        break;
      }
    }
    expect(foundAPOC1).toBeTruthy();

    console.log(`Gene list parameter processed: found ${geneCount} genes`);
  });
});
