# Bgee Component Tests

This directory contains end-to-end tests for key React components in the Bgee application, using Playwright for browser automation.

## Test Files

### `gene-expression-matrix.test.ts`

Comprehensive tests for the Gene Expression Matrix page (`/search/expression-matrix`), including:

- Page loading and UI elements
- Species selection with react-select
- Gene search with autocomplete
- Data type and quality selection
- Search functionality and results display
- Form reset functionality
- Loading states
- URL parameter handling
- Gene list parameter processing
- End-to-end search workflows

### `gene-expression-graph.test.ts`

Tests for the Gene Expression Graph component on gene pages (`/gene/:geneId`), including:

- Graph section display
- Data type selection and filtering
- Select All/Unselect All functionality
- Heatmap visualization
- Loading states
- URL parameter persistence
- Anatomical term expansion
- No data handling

### `website.test.ts`

Existing general website tests covering:

- Gene, species, and experiment pages
- Search functionality
- Home page and markdown pages

## Running Tests

### Prerequisites

1. Make sure the development server is running:

   ```bash
   npm run dev
   ```

2. Ensure Playwright is installed:
   ```bash
   npm install
   ```

### Running All Tests

```bash
npm test
```

### Running Component Tests Only

#### Using the test runner script (recommended):

```bash
# Run all component tests
./run-component-tests.sh all

# Run only GeneExpressionMatrix tests
./run-component-tests.sh matrix

# Run only GeneExpressionGraph tests
./run-component-tests.sh graph

```

#### Using Playwright directly:

```bash
# Run all component tests
npx playwright test tests/gene-expression-matrix.test.ts tests/gene-expression-graph.test.ts

# Run specific test file
npx playwright test tests/gene-expression-matrix.test.ts

# Run with browser UI (headed mode)
npx playwright test tests/gene-expression-matrix.test.ts --headed

# Run in debug mode
npx playwright test tests/gene-expression-matrix.test.ts --debug
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:

- Multiple browser support (Chrome, Firefox, Safari)
- Automatic dev server startup
- HTML reporter for test results
- Retry logic for CI environments

## Writing New Tests

When adding new component tests:

1. **Follow the existing pattern**: Use `test.describe()` for grouping related tests
2. **Use descriptive test names**: Clearly describe what each test validates
3. **Wait for elements**: Use `page.waitForTimeout()` and `page.waitForLoadState()` for async operations
4. **Check for loading states**: Verify loading indicators appear and disappear
5. **Handle edge cases**: Test both success and failure scenarios
6. **Use realistic data**: Use actual gene IDs and species that exist in the database

### Example Test Structure:

```typescript
test.describe('Component Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
    await page.waitForLoadState('networkidle');
  });

  test('should display component correctly', async ({ page }) => {
    await expect(page.getByText('Expected Text')).toBeVisible();
  });

  test('should handle user interactions', async ({ page }) => {
    await page.getByRole('button', { name: 'Click Me' }).click();
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase wait times or add more specific waiting conditions
2. **Elements not found**: Check if selectors match the actual DOM structure
3. **Dev server not running**: Ensure `npm run dev` is running on port 5173
4. **Browser issues**: Try running with `--headed` flag to see what's happening

### Debug Mode

Run tests in debug mode to step through them:

```bash
npx playwright test tests/gene-expression-matrix.test.ts --debug
```

### Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Use page object pattern**: For complex pages, consider creating page object classes
3. **Mock external APIs**: If needed, use Playwright's request interception
4. **Clean up**: Ensure tests don't leave the application in a bad state
5. **Test user journeys**: Focus on testing complete user workflows rather than isolated functions

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate comments for complex test logic
3. Ensure tests are reliable and don't flake
4. Update this README if adding new test categories
