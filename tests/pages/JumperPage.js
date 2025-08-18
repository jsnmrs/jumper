// @ts-check
import { expect } from "@playwright/test";
import { 
  setupJumperPage, 
  pressTabTimes, 
  expectFocusedAndVisible,
  expectJumperTabindex,
  activateSkipLinkAndWaitForFocus,
  Selectors 
} from "../helpers.js";

/**
 * Page Object Model for the Jumper demo page
 * Encapsulates all interactions with the demo page for better test maintainability
 */
export class JumperPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the demo page and wait for jumper to initialize
   */
  async goto() {
    await setupJumperPage(this.page);
  }

  /**
   * Navigate via keyboard to a specific skip link by tab count
   * @param {number} tabCount - Number of tabs to press
   * @returns {Promise<void>}
   */
  async navigateToSkipLink(tabCount) {
    await pressTabTimes(this.page, tabCount);
  }

  /**
   * Debug helper to see what element is currently focused
   * @returns {Promise<string>} Description of focused element
   */
  async debugCurrentFocus() {
    return await this.page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return 'No active element';
      return `Element: ${active.tagName}${active.id ? `#${active.id}` : ''}${active.className ? `.${active.className}` : ''}, text: "${active.textContent?.slice(0, 50)}"`;
    });
  }

  /**
   * Navigate to a specific skip link by name, using Tab navigation
   * @param {string} skipLinkName - The accessible name of the skip link
   * @returns {Promise<void>}
   */
  async navigateToSkipLinkByName(skipLinkName) {
    const skipLink = this.getSkipLinkByName(skipLinkName);
    
    // Press Tab until we reach the desired skip link (max 20 tabs to avoid infinite loops)
    for (let i = 0; i < 20; i++) {
      await this.page.keyboard.press("Tab");
      await this.page.waitForTimeout(50); // Small delay for focus changes
      
      // Check if the current skip link is focused
      const isFocused = await skipLink.isVisible() && await skipLink.evaluate(el => el === document.activeElement);
      if (isFocused) {
        return; // Found and focused the target link
      }
    }
    
    throw new Error(`Could not navigate to skip link "${skipLinkName}" within 20 tabs`);
  }

  /**
   * Get a skip link by role and name
   * @param {string} name - The accessible name of the skip link
   * @returns {import('@playwright/test').Locator}
   */
  getSkipLinkByName(name) {
    return this.page.getByRole("link", { name, exact: true });
  }

  /**
   * Get a target element by ID
   * @param {string} id - The element ID
   * @returns {import('@playwright/test').Locator}
   */
  getTargetElement(id) {
    return this.page.locator(Selectors.targetElement(id));
  }

  /**
   * Get a skip link by class name
   * @param {string} className - The CSS class name
   * @returns {import('@playwright/test').Locator}
   */
  getSkipLinkByClass(className) {
    return this.page.locator(Selectors.skipLink(className));
  }

  /**
   * Test complete skip link functionality
   * @param {number} tabsToSkipLink - Number of tabs to reach the skip link
   * @param {string} skipLinkName - Accessible name of the skip link
   * @param {string} targetId - ID of the target element
   * @param {boolean} [shouldHaveTabindex=true] - Whether target should have tabindex="-1"
   */
  async testSkipLinkFlow(tabsToSkipLink, skipLinkName, targetId, shouldHaveTabindex = true) {
    const skipLink = this.getSkipLinkByName(skipLinkName);
    
    // WebKit has different tab order - use dynamic navigation for problematic links
    const isWebKit = await this.page.evaluate(() => navigator.userAgent.includes('WebKit') && !navigator.userAgent.includes('Chrome'));
    
    if (isWebKit && (skipLinkName.includes('#skip1') || skipLinkName.includes('#skip8'))) {
      // For WebKit, the navigation links aren't in the tab order, so we navigate dynamically
      await this.navigateToSkipLinkByName(skipLinkName);
    } else {
      // Use normal tab navigation
      await this.navigateToSkipLink(tabsToSkipLink);
    }
    
    // Verify skip link is focused
    await expect(skipLink).toBeFocused();
    
    // Activate skip link and verify target receives focus
    const targetElement = this.getTargetElement(targetId);
    
    // Ensure skip link is focused first
    await expect(skipLink).toBeFocused();
    
    // Activate the skip link
    await this.page.keyboard.press("Enter");
    
    // Wait for navigation and focus to be set on target
    await expect(targetElement).toBeVisible();
    await expect(targetElement).toBeFocused({ timeout: 5000 });
    
    // Ensure the skip link itself is no longer focused
    await expect(skipLink).not.toBeFocused();
    
    // Verify target has proper tabindex (only if it should have one)
    if (shouldHaveTabindex) {
      await expect(targetElement).toHaveAttribute("tabindex", "-1");
    } else {
      // Naturally focusable elements shouldn't have tabindex added
      await expect(targetElement).not.toHaveAttribute("tabindex");
    }
  }

  /**
   * Test Unicode element has proper jumper tabindex
   * @param {string} elementId - ID of the Unicode element
   */
  async testUnicodeElement(elementId) {
    await expectJumperTabindex(this.page, Selectors.targetElement(elementId));
  }

  /**
   * Verify jumper is properly initialized
   */
  async verifyJumperInitialization() {
    await expect(this.page.locator("body")).toHaveClass(/has-jumper/);
    
    const apiAvailable = await this.page.evaluate(() => {
      return typeof window.jumper !== "undefined";
    });
    expect(apiAvailable).toBe(true);
  }

  /**
   * Verify jumper API functionality
   */
  async verifyJumperAPI() {
    const results = await this.page.evaluate(() => {
      return {
        isActive: window.jumper && 
                 typeof window.jumper.isActive === "function" && 
                 window.jumper.isActive(),
        hasConfig: window.jumper && 
                  typeof window.jumper.getConfig === "function" && 
                  typeof window.jumper.getConfig() === "object",
        hasVersion: window.jumper && 
                   typeof window.jumper.version === "string"
      };
    });

    expect(results.isActive).toBe(true);
    expect(results.hasConfig).toBe(true);
    expect(results.hasVersion).toBe(true);
  }

  /**
   * Test that naturally focusable elements are not modified
   * @param {string[]} elementIds - Array of element IDs to test
   */
  async verifyNaturallyFocusableElementsUnmodified(elementIds) {
    for (const id of elementIds) {
      const element = this.getTargetElement(id);
      await expect(element).not.toHaveAttribute("tabindex");
    }
  }

  /**
   * Test that elements with existing tabindex are preserved
   * @param {string} elementId - Element ID to test
   * @param {string} expectedTabindex - Expected tabindex value
   */
  async verifyExistingTabindexPreserved(elementId, expectedTabindex) {
    const element = this.getTargetElement(elementId);
    await expect(element).toHaveAttribute("tabindex", expectedTabindex);
  }
}