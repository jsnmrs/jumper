// @ts-check
import { test, expect } from "@playwright/test";
import { JumperPage } from "./pages/JumperPage.js";
import { Selectors } from "./helpers.js";

test.describe("Unicode and special character ID handling", () => {
  /** @type {JumperPage} */
  let jumperPage;

  test.beforeEach(async ({ page }) => {
    jumperPage = new JumperPage(page);
    await jumperPage.goto();
  });

  test("should handle Chinese characters in IDs", async () => {
    await jumperPage.testUnicodeElement("测试");
  });

  test("should handle accented characters in IDs", async () => {
    await jumperPage.testUnicodeElement("café");
  });

  test("should handle emoji characters in IDs", async () => {
    await jumperPage.testUnicodeElement("🚀emoji");
  });

  test("should handle Cyrillic characters in IDs", async () => {
    await jumperPage.testUnicodeElement("привет");
  });

  test("should handle Spanish characters in IDs", async () => {
    await jumperPage.testUnicodeElement("ñoño");
  });

  test("should handle mixed special characters in IDs", async () => {
    await jumperPage.testUnicodeElement("special-chars_123");
  });

  test("should handle all Unicode elements correctly", async ({ page }) => {
    const unicodeIds = [
      "测试",
      "café",
      "🚀emoji",
      "привет",
      "ñoño",
      "special-chars_123",
    ];

    // Count all elements that should have tabindex="-1"
    const unicodeElementsSelector = unicodeIds
      .map((id) => `[id="${id}"]`)
      .join(", ");
    const unicodeElements = await page.locator(unicodeElementsSelector).count();
    expect(unicodeElements).toBe(6);

    // Verify all have tabindex="-1"
    const elementsWithTabindexSelector = unicodeIds
      .map((id) => Selectors.unicodeElement(id))
      .join(", ");
    const elementsWithTabindex = await page
      .locator(elementsWithTabindexSelector)
      .count();
    expect(elementsWithTabindex).toBe(6);
  });
});

test.describe("Edge case handling", () => {
  /** @type {JumperPage} */
  let jumperPage;

  test.beforeEach(async ({ page }) => {
    jumperPage = new JumperPage(page);
    await jumperPage.goto();
  });

  test("should not affect elements that already have tabindex", async () => {
    // Elements with existing tabindex should not be modified
    await jumperPage.verifyExistingTabindexPreserved("skip0", "-1");

    // Check the specific div element with role="button" and tabindex="0"
    const { page } = jumperPage;
    const roleButtonWithTabindex = page.locator(
      'div[role="button"][tabindex="0"]',
    );
    await expect(roleButtonWithTabindex).toHaveAttribute("tabindex", "0");
  });

  test("should not affect naturally focusable elements", async () => {
    await jumperPage.verifyNaturallyFocusableElementsUnmodified([
      "skip9", // button
      "skip10", // input
      "skip11", // select
      "skip12", // textarea
    ]);
  });

  test("should handle contentEditable elements correctly", async ({ page }) => {
    // contentEditable elements should not get tabindex added
    const contentEditable = page.locator('[contentEditable="true"]');
    await expect(contentEditable).not.toHaveAttribute("tabindex");
  });

  test("should verify jumper API is available", async () => {
    await jumperPage.verifyJumperInitialization();
    await jumperPage.verifyJumperAPI();
  });
});
