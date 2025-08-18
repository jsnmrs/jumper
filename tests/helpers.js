// @ts-check
import { expect } from "@playwright/test";

/**
 * Common page setup for all jumper tests
 * @param {import('@playwright/test').Page} page
 */
export async function setupJumperPage(page) {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  // Wait for jumper to initialize
  await page.waitForFunction(
    () => {
      return (
        document.body.classList.contains("has-jumper") &&
        window.jumper &&
        typeof window.jumper.isActive === "function"
      );
    },
    { timeout: 10000 },
  );

  await expect(page.locator("body")).toHaveClass(/has-jumper/);
}

/**
 * Press Tab key multiple times for keyboard navigation testing
 * @param {import('@playwright/test').Page} page
 * @param {number} count - Number of times to press Tab
 */
export async function pressTabTimes(page, count) {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press("Tab");
    // Small delay to ensure focus changes are processed
    await page.waitForTimeout(50);
  }
}

/**
 * Test that an element is focused and visible
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector for the element
 */
export async function expectFocusedAndVisible(page, selector) {
  const element = page.locator(selector);

  // Wait for element to be visible before checking focus
  await expect(element).toBeVisible();

  // Wait for focus to be properly set
  await expect(element).toBeFocused({ timeout: 5000 });
}

/**
 * Test that an element has tabindex="-1" and can receive focus
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector for the element
 */
export async function expectJumperTabindex(page, selector) {
  const element = page.locator(selector);

  // Wait for element to be visible and have tabindex applied
  await expect(element).toBeVisible();
  await expect(element).toHaveAttribute("tabindex", "-1", { timeout: 5000 });

  // Test that the element can receive focus
  await element.focus();
  await expect(element).toBeFocused({ timeout: 3000 });
}

/**
 * Wait for skip link navigation to complete
 * @param {import('@playwright/test').Page} page
 * @param {string} linkSelector - Selector for the skip link
 * @param {string} targetSelector - Selector for the target element
 */
export async function activateSkipLinkAndWaitForFocus(
  page,
  linkSelector,
  targetSelector,
) {
  const skipLink = page.locator(linkSelector);

  // Ensure skip link is focused first
  await expect(skipLink).toBeFocused();

  // Activate the skip link
  await page.keyboard.press("Enter");

  // Wait for navigation and focus to be set on target
  await expectFocusedAndVisible(page, targetSelector);

  // Ensure the skip link itself is no longer focused
  await expect(skipLink).not.toBeFocused();
}

/**
 * Standardized selectors for consistent locator usage
 */
export const Selectors = {
  jumperBody: "body.has-jumper",
  skipLink: (className) => `.${className}`,
  skipLinkByHref: (id) => `a[href="#${id}"]`,
  targetElement: (id) => `#${id}`,
  unicodeElement: (id) => `#${id}[tabindex="-1"]`,
  skipLinkByText: (text) => `a:has-text("${text}")`,
};
