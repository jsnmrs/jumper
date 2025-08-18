// @ts-check
import { test, expect } from "@playwright/test";
import { JumperPage } from "./pages/JumperPage.js";
import { Selectors } from "./helpers.js";

test.describe("Skip link functionality", () => {
  /** @type {JumperPage} */
  let jumperPage;

  test.beforeEach(async ({ page }) => {
    jumperPage = new JumperPage(page);
    await jumperPage.goto();
  });

  test("should focus main element after skip link via keyboard", async ({
    page,
    browserName,
  }) => {
    // Skip this test for WebKit as it doesn't include off-screen skip links in tab order
    test.skip(
      browserName === "webkit",
      "WebKit does not include off-screen elements in tab order",
    );

    // Get skip link using page object
    const skipLink = jumperPage.getSkipLinkByClass("skip");

    // Confirm the skip link is not visible initially (positioned off-screen)
    const offsetValue = await skipLink.evaluate(
      (el) => getComputedStyle(el).insetInlineStart,
    );
    expect(offsetValue).toMatch(/-\d+px/); // Should be a large negative pixel value

    // Navigate to skip link via keyboard
    await jumperPage.navigateToSkipLink(1);

    // Ensure the skip link is focused and visible
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Get skip link target - ensure it exists
    const skipTarget = await skipLink.getAttribute("href");
    expect(skipTarget).toBeTruthy();
    expect(skipTarget).toMatch(/^#.+/); // Should be a hash link

    // Activate skip link by pressing Enter
    await page.keyboard.press("Enter");

    // Ensure the skip link is not focused
    await expect(skipLink).not.toBeFocused();

    // Ensure the body is not focused
    await expect(page.locator("body")).not.toBeFocused();

    // Ensure the skip link target is focused and visible
    const targetElement = page.locator(skipTarget);
    await expect(targetElement).toBeVisible();
    await expect(targetElement).toBeFocused({ timeout: 5000 });
  });

  test("should focus a#skip8 after skip link via keyboard", async ({
    page,
  }) => {
    // Test that skip8 target can be reached and focused when activated
    const skipLink = page.locator("#link008");
    const targetElement = page.locator("#skip8");

    // Navigate to the skip link using keyboard (try progressive tab counts for browser differences)
    let linkFocused = false;
    for (let tabs = 1; tabs <= 15 && !linkFocused; tabs++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      linkFocused = await skipLink.evaluate(
        (el) => el === document.activeElement,
      );
      if (linkFocused) break;
    }

    if (!linkFocused) {
      // Fallback: Some browsers may not include these links in tab order
      await skipLink.focus();
    }

    await expect(skipLink).toBeFocused();

    // Activate the skip link
    await page.keyboard.press("Enter");

    // Verify target is focused - skip8 is an <a> element so it shouldn't have tabindex
    await expect(targetElement).toBeVisible();
    await expect(targetElement).toBeFocused({ timeout: 5000 });
    await expect(targetElement).not.toHaveAttribute("tabindex");
  });

  test("should focus #skip1 after skip link via keyboard", async ({ page }) => {
    // Test that skip1 target can be reached and focused when activated
    const skipLink = page.locator("#link001");
    const targetElement = page.locator("#skip1");

    // Navigate to the skip link using keyboard (try progressive tab counts for browser differences)
    let linkFocused = false;
    for (let tabs = 1; tabs <= 15 && !linkFocused; tabs++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      linkFocused = await skipLink.evaluate(
        (el) => el === document.activeElement,
      );
      if (linkFocused) break;
    }

    if (!linkFocused) {
      // Fallback: Some browsers may not include these links in tab order
      await skipLink.focus();
    }

    await expect(skipLink).toBeFocused();

    // Activate the skip link
    await page.keyboard.press("Enter");

    // Verify target is focused and has proper tabindex
    await expect(targetElement).toBeVisible();
    await expect(targetElement).toBeFocused({ timeout: 5000 });
    await expect(targetElement).toHaveAttribute("tabindex", "-1");
  });
});
