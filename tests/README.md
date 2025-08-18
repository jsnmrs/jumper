# Jumper Test Suite

Comprehensive test suite for the Jumper accessibility library using Playwright.

## Test Structure

### Test Files

- **`skip.spec.js`** - Tests skip link functionality and keyboard navigation
- **`unicode.spec.js`** - Tests Unicode character support and edge cases  
- **`axe.spec.js`** - Accessibility compliance testing with axe-core

### Support Files

- **`helpers.js`** - Shared test utilities and helper functions
- **`pages/JumperPage.js`** - Page Object Model for the demo page

## Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test skip.spec.js

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=firefox
```

### CI/CD
Tests run automatically on pull requests with multi-browser support (Chromium, Firefox, WebKit).

## Test Configuration

### Browser Support
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox) 
- **WebKit** (Desktop Safari)

### Timeouts
- **Action timeout**: 10 seconds
- **Navigation timeout**: 30 seconds
- **Test timeout**: 30 seconds (default)

### Error Reporting
- **Videos**: Captured only on test failures
- **Screenshots**: Captured only on test failures
- **Traces**: Captured on first retry

## Test Architecture

### Page Object Model
The `JumperPage` class encapsulates all interactions with the demo page:

```javascript
const jumperPage = new JumperPage(page);
await jumperPage.goto();
await jumperPage.testSkipLinkFlow(3, "Test #skip1", "skip1");
```

### Helper Functions
Reusable test utilities in `helpers.js`:

- `setupJumperPage(page)` - Standard page initialization
- `pressTabTimes(page, count)` - Keyboard navigation
- `expectFocusedAndVisible(page, selector)` - Focus verification
- `expectJumperTabindex(page, selector)` - Tabindex verification

### Standardized Selectors
Consistent element targeting via `Selectors` object:

```javascript
Selectors.targetElement("skip1")      // "#skip1"
Selectors.skipLink("skip")           // ".skip"
Selectors.unicodeElement("café")     // "#café[tabindex='-1']"
```

## Test Categories

### 1. Skip Link Functionality (`skip.spec.js`)
Tests keyboard navigation and focus management:
- Tab navigation to skip links
- Skip link activation with Enter key
- Target element focus verification
- Multiple skip link scenarios

### 2. Unicode Support (`unicode.spec.js`)
Tests international character support:
- Chinese characters (测试)
- Accented characters (café)
- Emoji characters (🚀emoji) 
- Cyrillic characters (привет)
- Spanish characters (ñoño)
- Mixed special characters

### 3. Edge Cases (`unicode.spec.js`)
Tests boundary conditions:
- Elements with existing tabindex
- Naturally focusable elements (buttons, inputs)
- ContentEditable elements
- API availability and functionality

### 4. Accessibility Compliance (`axe.spec.js`)
Comprehensive accessibility testing:
- WCAG 2.0/2.1/2.2 compliance (A, AA, AAA)
- Section 508 compliance
- EN 301 549 compliance
- Best practices and experimental rules

## Writing New Tests

### Basic Test Structure
```javascript
import { test, expect } from "@playwright/test";
import { JumperPage } from "./pages/JumperPage.js";

test.describe("Feature description", () => {
  let jumperPage;

  test.beforeEach(async ({ page }) => {
    jumperPage = new JumperPage(page);
    await jumperPage.goto();
  });

  test("should do something specific", async () => {
    // Test implementation
  });
});
```

### Best Practices

1. **Use Page Object Model**: Encapsulate page interactions in `JumperPage`
2. **Wait for Conditions**: Use explicit waits instead of fixed delays
3. **Descriptive Test Names**: Clearly describe the expected behavior
4. **Consistent Setup**: Always use `jumperPage.goto()` for initialization
5. **Error Context**: Include meaningful assertions and error messages

### Adding New Helper Functions

When adding utilities to `helpers.js`:

1. Add JSDoc documentation with parameter types
2. Include proper error handling and timeouts
3. Use consistent naming conventions
4. Export functions for use in tests

### Debugging Tests

```bash
# Run with debug mode
npx playwright test --debug

# Run with trace viewer
npx playwright test --trace on

# Generate HTML report
npx playwright show-report
```

## Performance Considerations

- Tests run in parallel by default for faster execution
- Network idle waits ensure page stability
- Explicit timeouts prevent hanging tests
- Resource cleanup via `beforeEach`/`afterEach` hooks

## Accessibility Testing

The test suite prioritizes accessibility:
- axe-core integration for automated a11y testing
- Focus management verification
- Keyboard navigation testing
- ARIA compliance checking
- Screen reader compatibility

## Maintenance

### Regular Updates
- Keep Playwright version current
- Update browser versions in CI
- Review and update accessibility rules
- Monitor test flakiness and timing issues

### Adding New Features
When adding new jumper features:
1. Add corresponding test coverage
2. Update Page Object Model methods
3. Document new test scenarios
4. Verify cross-browser compatibility