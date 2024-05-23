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
