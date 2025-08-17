/**
 * Jumper - Ensures jump links move keyboard focus to non-focusable elements
 * 
 * This IIFE automatically enhances elements with IDs to be focusable via jump links
 * by adding tabindex="-1" to elements that aren't naturally focusable.
 * 
 * @function jumper
 * @version 1.0.0
 * @author Jason Morris
 * @license MIT
 * 
 * @description
 * When the DOM is ready, this function:
 * 1. Adds 'has-jumper' class to body for CSS feature detection
 * 2. Finds all elements with IDs that aren't naturally focusable
 * 3. Adds tabindex="-1" to make them focusable without affecting tab order
 * 
 * @example
 * // Automatically runs when script is loaded
 * // No manual initialization required
 * 
 * @see {@link https://jasonmorris.com/code/jumper/} Documentation
 * @see {@link https://github.com/jsnmrs/jumper} Source code
 */
(function jumper() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("has-jumper");

    // Get all elements that have an ID attribute, are not inherently focusable, and do not have an existing tabindex attribute.
    const jumpTargets = document.querySelectorAll(
      "[id]:not(a[href], area[href], button, iframe, input, select, textarea, [contentEditable='true'], [tabindex])",
    );

    // Add tabindex="-1" so element can receive focus, without being added to the page tab order.
    jumpTargets.forEach((jumpTarget) =>
      jumpTarget.setAttribute("tabindex", "-1"),
    );
  });
})();
