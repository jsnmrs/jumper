/**
 * Jumper - Ensures jump links move keyboard focus to non-focusable elements
 * 
 * This library automatically enhances elements with IDs to be focusable via jump links
 * by adding tabindex="-1" to elements that aren't naturally focusable.
 * 
 * @namespace Jumper
 * @version 1.0.0
 * @author Jason Morris
 * @license MIT
 * 
 * @see {@link https://jasonmorris.com/code/jumper/} Documentation
 * @see {@link https://github.com/jsnmrs/jumper} Source code
 */
(function (global) {
  "use strict";

  /**
   * Default configuration options
   * @type {Object}
   */
  const defaultConfig = {
    selector: "[id]:not(a[href], area[href], button, iframe, input, select, textarea, [contentEditable='true'], [tabindex])",
    bodyClass: "has-jumper",
    tabindex: "-1",
    enablePerformanceMarks: false
  };

  /**
   * Current configuration (merged with defaults)
   * @type {Object}
   */
  let config = { ...defaultConfig };

  /**
   * Initialize Jumper with optional configuration
   * 
   * @param {Object} [userConfig] - Configuration options
   * @param {string} [userConfig.selector] - Custom CSS selector for elements to make focusable
   * @param {string} [userConfig.bodyClass] - CSS class to add to body element
   * @param {string} [userConfig.tabindex] - Tabindex value to assign to target elements
   * @param {boolean} [userConfig.enablePerformanceMarks] - Whether to enable performance monitoring
   * 
   * @example
   * // Use default settings
   * jumper.init();
   * 
   * @example
   * // Custom configuration
   * jumper.init({
   *   selector: '[id].jump-target:not([tabindex])',
   *   bodyClass: 'custom-jumper',
   *   tabindex: '0'
   * });
   */
  function init(userConfig = {}) {
    try {
      if (config.enablePerformanceMarks) {
        performance.mark('jumper-init-start');
      }

      // Merge user config with defaults
      config = { ...defaultConfig, ...userConfig };

      // Add feature detection class to body
      document.body.classList.add(config.bodyClass);

      // Find all target elements using configured selector
      const jumpTargets = document.querySelectorAll(config.selector);

      if (config.enablePerformanceMarks) {
        performance.mark('jumper-query-complete');
      }

      // Add tabindex to make elements focusable
      jumpTargets.forEach((jumpTarget) => {
        jumpTarget.setAttribute("tabindex", config.tabindex);
        jumpTarget.hasJumperTabindex = true;
      });

      if (config.enablePerformanceMarks) {
        performance.mark('jumper-init-end');
        performance.measure('jumper-init-duration', 'jumper-init-start', 'jumper-init-end');
        performance.measure('jumper-query-duration', 'jumper-init-start', 'jumper-query-complete');
      }

    } catch (error) {
      console.warn('Jumper initialization failed:', error);
    }
  }

  /**
   * Check if Jumper has been initialized
   * @returns {boolean} true if body has the jumper class
   */
  function isActive() {
    return document.body.classList.contains(config.bodyClass);
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration object
   */
  function getConfig() {
    return { ...config };
  }

  /**
   * Jumper API object
   */
  const jumper = {
    init,
    isActive,
    getConfig,
    version: "1.0.0"
  };

  // Auto-initialize on DOMContentLoaded with default settings
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    // DOM is already loaded
    init();
  }

  // Expose API to global scope and window object
  global.jumper = jumper;
  if (typeof window !== 'undefined') {
    window.jumper = {
      config: getConfig(),
      isActive: isActive()
    };
  }

})(typeof global !== 'undefined' ? global : this);
