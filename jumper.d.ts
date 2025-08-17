/**
 * Jumper TypeScript definitions
 * Ensures jump links move keyboard focus to non-focusable elements
 * 
 * @version 1.0.0
 * @author Jason Morris
 * @license MIT
 */

declare module 'jumper' {
  /**
   * Configuration options for the Jumper library
   */
  interface JumperConfig {
    /** Custom CSS selector for elements to make focusable (default: includes all non-focusable elements with IDs) */
    selector?: string;
    /** CSS class to add to body element for feature detection (default: 'has-jumper') */
    bodyClass?: string;
    /** Whether to enable performance monitoring (default: false) */
    enablePerformanceMarks?: boolean;
  }

  /**
   * Jumper initialization function
   * Automatically enhances elements with IDs to be focusable via jump links
   * 
   * @param config - Optional configuration object
   * @returns void
   */
  function jumper(config?: JumperConfig): void;

  /**
   * Check if Jumper has been initialized on the current page
   * @returns true if the body has the jumper class
   */
  function isJumperActive(): boolean;

  export { jumper as default, JumperConfig, isJumperActive };
}

/**
 * Global type augmentation for window object
 */
declare global {
  interface Window {
    /** Jumper library instance */
    jumper?: {
      config?: JumperConfig;
      isActive: boolean;
    };
  }

  interface HTMLElement {
    /** Enhanced for jump link targeting */
    hasJumperTabindex?: boolean;
  }
}

export {};