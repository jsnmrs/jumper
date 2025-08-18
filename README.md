# jumper
Ensure jump links move keyboard focus. Read the [Jumper blog post](https://jasonmorris.com/code/jumper).

**[🚀 Live Demo](https://jsnmrs.github.io/jumper/)**

>The majority of users suggested skip links are less efficient for them than other methods of bypassing repeated content. (They also mentioned that **much of the time skip links are broken because often the keyboard focus does not move**.)
>
>Later, I went on to read the latest WebAim screen reader survey which states:
>
>"It's important to note that "skip" links provide distinct benefits for sighted keyboard users, even if their usage among screen reader users is mixed."

via [Jess Budd's _5 takeaways from screen reader usability interviews_](https://jessbudd.com/blog/screen-reader-usability-testing-observations/)

## Features

- 🎯 **Automatic focus management** - Adds `tabindex="-1"` to elements with IDs that aren't naturally focusable
- ⚙️ **Configurable** - Customize selectors, CSS classes, and tabindex values
- 🌐 **Unicode support** - Handles IDs with international characters, emojis, and special characters
- 🔒 **Safe** - Graceful error handling and doesn't modify already-focusable elements
- 📊 **Performance monitoring** - Optional performance marks for debugging
- 🧪 **Well-tested** - Comprehensive test suite with accessibility testing via axe-core
- 🚀 **Lightweight** - Zero runtime dependencies, minimal footprint
- 📘 **TypeScript support** - Full type definitions included

## Installation

### Download and include

1. Download `jumper.js` from the [releases page](https://github.com/jsnmrs/jumper/releases) or clone this repository
2. Include the script in your HTML:

```html
<script src="path/to/jumper.js"></script>
```

### Via CDN (jsDelivr)
```html
<script src="https://cdn.jsdelivr.net/gh/jsnmrs/jumper@main/jumper.js"></script>
```

## Usage

### Basic usage (automatic)

Simply include the script in your HTML - it will automatically initialize when the DOM is ready:

```html
<script src="jumper.js"></script>
```

### Advanced usage (manual configuration)

```javascript
// Custom configuration
jumper.init({
  selector: '[id].jump-target:not([tabindex])',  // Custom selector
  bodyClass: 'custom-jumper',                    // Custom CSS class
  enablePerformanceMarks: true                   // Enable performance monitoring
});

// Check if jumper is active
if (jumper.isActive()) {
  console.log('Jumper is running');
}

// Get current configuration
const config = jumper.getConfig();
console.log('Current config:', config);
```

## Configuration

### Default Configuration
```javascript
{
  selector: "[id]:not(a[href], area[href], button, iframe, input, select, textarea, [contentEditable='true'], [tabindex])",
  bodyClass: "has-jumper",
  enablePerformanceMarks: false
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | string | `"[id]:not(a[href], area[href], button, iframe, input, select, textarea, [contentEditable='true'], [tabindex])"` | CSS selector for elements to make focusable |
| `bodyClass` | string | `"has-jumper"` | CSS class to add to body element for feature detection |
| `enablePerformanceMarks` | boolean | `false` | Enable performance monitoring marks |

## API Reference

### Methods

#### `jumper.init(config?)`
Initialize or reconfigure Jumper.

**Parameters:**
- `config` (optional): Configuration object with the options listed above

**Example:**
```javascript
jumper.init({
  selector: '[id].focusable:not([tabindex])',
  bodyClass: 'custom-jumper',
  enablePerformanceMarks: true
});
```

#### `jumper.isActive()`
Returns `true` if Jumper has been initialized and the body has the jumper class.

**Returns:** `boolean`

#### `jumper.getConfig()`
Returns a copy of the current configuration object.

**Returns:** `object`

#### `jumper.version`
Current version string.

**Returns:** `string`

## TypeScript Support

Jumper includes TypeScript definitions out of the box:

```typescript
import { jumper, JumperConfig } from 'jumper';

const config: JumperConfig = {
  selector: '[id].focusable:not([tabindex])',
  enablePerformanceMarks: true
};

jumper.init(config);

if (jumper.isActive()) {
  console.log('Jumper is running');
}
```

## Performance Monitoring

Enable performance monitoring to measure initialization time:

```javascript
jumper.init({ enablePerformanceMarks: true });

// Check performance marks in DevTools
performance.getEntriesByType('mark').filter(mark => 
  mark.name.startsWith('jumper-')
);

// Check performance measures  
performance.getEntriesByType('measure').filter(measure => 
  measure.name.includes('jumper')
);
```

Available performance marks:
- `jumper-init-start` - Initialization begins
- `jumper-query-complete` - DOM query completed
- `jumper-init-end` - Initialization finished

Available performance measures:
- `jumper-init-duration` - Total initialization time
- `jumper-query-duration` - Time to find target elements

## Error Handling

Jumper includes graceful error handling. If initialization fails, a warning will be logged to the console, but your application will continue to function normally. Common scenarios handled:

- DOM not ready when script loads
- Invalid CSS selectors
- Missing Performance API (when performance monitoring is enabled)
- Elements that can't receive focus

## Browser compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **Core functionality** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ |
| **querySelector** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ |
| **addEventListener** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ |
| **classList** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ |
| **Performance API** | ✅ 25+ | ✅ 38+ | ✅ 8+ | ✅ 12+ |
| **Unicode IDs** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ |

### Minimum requirements
- **ES6 features**: const, let, arrow functions, object spread
- **DOM APIs**: querySelector, addEventListener, classList
- **Optional**: Performance API (for performance monitoring)

### Notes
- Performance monitoring requires browsers with Performance API support
- Unicode ID support works in all modern browsers
- Mobile browsers (iOS Safari 8+, Chrome Mobile 18+) are fully supported

## Running locally

1. `npm install`
2. `npm run start`

## Testing

Run the test suite with:

```bash
npm test
```

The test suite includes:
- ✅ **Accessibility testing** with axe-core
- ✅ **Functional testing** with Playwright  
- ✅ **Unicode support testing** for international characters
- ✅ **Edge case testing** for various ID formats
- ✅ **API testing** for configuration and method availability
- ✅ **Error handling testing** for edge cases and failures

### Test Coverage
- Skip link functionality across different element types
- Unicode ID support (Chinese, Cyrillic, emoji, accented characters)
- Edge cases (existing tabindex, naturally focusable elements)
- API availability and configuration
- Accessibility compliance via axe-core

## Version

**Current version:** 1.0.0

### What's New in v1.0.0
- ✨ **Configurable API** - Initialize with custom selectors and options
- 🌐 **Unicode support** - Full support for international characters in IDs
- 📘 **TypeScript definitions** - Complete type definitions included
- 📊 **Performance monitoring** - Optional performance marks for debugging
- 🔒 **Error handling** - Graceful error handling with console warnings
- 🧪 **Enhanced testing** - Comprehensive test suite with Unicode and edge cases
- ⚙️ **ES module support** - Full ES6 module compatibility
- 📚 **API documentation** - Complete API reference and examples

### Breaking Changes from v0.x
- Now requires ES6+ browser support
- Configuration API changed (if upgrading from custom builds)

### Migration Guide
If you were using a previous version with basic inclusion:
```html
<!-- Old way - still works -->
<script src="jumper.js"></script>

<!-- New way - same behavior, more options available -->
<script src="jumper.js"></script>
<script>
  // Optional: customize behavior
  jumper.init({
    enablePerformanceMarks: true
  });
</script>
```

## Development

### Local setup

1. Clone the repository:
```bash
git clone https://github.com/jsnmrs/jumper.git
cd jumper
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers for testing:
```bash
npx playwright install
```

4. Run tests:
```bash
npm test
```

5. Start local development server:
```bash
npm run serve
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests to ensure everything works: `npm test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Project structure

- `jumper.js` - Main library file
- `jumper.d.ts` - TypeScript definitions
- `index.html` - Demo page
- `tests/` - Playwright test suite
- `.github/workflows/` - CI/CD configuration

## References

