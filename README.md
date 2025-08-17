# jumper
Ensure jump links move keyboard focus. Read the [Jumper blog post](https://jasonmorris.com/code/jumper).

<https://jsnmrs.github.io/jumper>

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
  tabindex: '0',                                 // Custom tabindex value
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

## Browser compatibility

| Feature | Chrome | Firefox | Safari | Edge | IE |
|---------|--------|---------|--------|------|----|
| **Core functionality** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ | ❌ |
| **querySelector** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ | ❌ |
| **addEventListener** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ | ❌ |
| **classList** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ | ❌ |
| **Performance API** | ✅ 25+ | ✅ 38+ | ✅ 8+ | ✅ 12+ | ❌ |
| **Unicode IDs** | ✅ 16+ | ✅ 4+ | ✅ 6+ | ✅ 12+ | ❌ |

### Minimum requirements
- **ES6 features**: const, let, arrow functions, object spread
- **DOM APIs**: querySelector, addEventListener, classList
- **Optional**: Performance API (for performance monitoring)

### Notes
- Internet Explorer is not supported due to ES6 requirements
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

## References

