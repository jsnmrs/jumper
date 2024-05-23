(function jumper() {
  "use strict";

  document.body.classList.add("has-jumper");

  window.addEventListener("DOMContentLoaded", jumpCheck);
  window.addEventListener("hashchange", jumpCheck);

  function jumpCheck() {
    let destination,
      cleanHash = /^#[a-zA-Z0-9%_:.-]+$/g;

    if (!window.location.hash || !cleanHash.test(window.location.hash)) {
      return;
    }

    destination = document.querySelector(window.location.hash);

    if (destination) {
      if (!/^(?:a|button|input|select|textarea)$/i.test(destination.tagName)) {
        forceFocus(destination);
      }
    }
  }

  function forceFocus(element) {
    element.focus();
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", -1);
      element.addEventListener("blur", clearOnBlur, true);
    }
  }

  function clearOnBlur(event) {
    event.target.removeAttribute("tabindex");
  }
})();
