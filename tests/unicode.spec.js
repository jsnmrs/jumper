// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Unicode and special character ID handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.locator("body")).toHaveClass(/has-jumper/);
  });

  test("should handle Chinese characters in IDs", async ({ page }) => {
    const element = page.locator("#测试");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle accented characters in IDs", async ({ page }) => {
    const element = page.locator("#café");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle emoji characters in IDs", async ({ page }) => {
    const element = page.locator("#🚀emoji");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle Cyrillic characters in IDs", async ({ page }) => {
    const element = page.locator("#привет");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle Spanish characters in IDs", async ({ page }) => {
    const element = page.locator("#ñoño");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle mixed special characters in IDs", async ({ page }) => {
    const element = page.locator("#special-chars_123");
    await expect(element).toBeVisible();
    await expect(element).toHaveAttribute("tabindex", "-1");
    
    // Test that the element can receive focus
    await element.focus();
    await expect(element).toBeFocused();
  });

  test("should handle all Unicode elements correctly", async ({ page }) => {
    // Count all elements that should have tabindex="-1"
    const unicodeElements = await page.locator('[id="测试"], [id="café"], [id="🚀emoji"], [id="привет"], [id="ñoño"], [id="special-chars_123"]').count();
    expect(unicodeElements).toBe(6);
    
    // Verify all have tabindex="-1"
    const elementsWithTabindex = await page.locator('[id="测试"][tabindex="-1"], [id="café"][tabindex="-1"], [id="🚀emoji"][tabindex="-1"], [id="привет"][tabindex="-1"], [id="ñoño"][tabindex="-1"], [id="special-chars_123"][tabindex="-1"]').count();
    expect(elementsWithTabindex).toBe(6);
  });
});

test.describe("Edge case handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.locator("body")).toHaveClass(/has-jumper/);
  });

  test("should not affect elements that already have tabindex", async ({ page }) => {
    // Elements with existing tabindex should not be modified
    const skipWithTabindex = page.locator("#skip0");
    await expect(skipWithTabindex).toHaveAttribute("tabindex", "-1");
    
    const roleButtonWithTabindex = page.locator('[role="button"][tabindex="0"]');
    await expect(roleButtonWithTabindex).toHaveAttribute("tabindex", "0");
  });

  test("should not affect naturally focusable elements", async ({ page }) => {
    // Check that buttons, inputs, etc. don't get modified
    const button = page.locator("#skip9");
    await expect(button).not.toHaveAttribute("tabindex");
    
    const input = page.locator("#skip10");
    await expect(input).not.toHaveAttribute("tabindex");
    
    const select = page.locator("#skip11");
    await expect(select).not.toHaveAttribute("tabindex");
    
    const textarea = page.locator("#skip12");
    await expect(textarea).not.toHaveAttribute("tabindex");
  });

  test("should handle contentEditable elements correctly", async ({ page }) => {
    // contentEditable elements should not get tabindex added
    const contentEditable = page.locator('[contentEditable="true"]');
    await expect(contentEditable).not.toHaveAttribute("tabindex");
  });

  test("should verify jumper API is available", async ({ page }) => {
    // Test that the jumper API is exposed globally
    const isActive = await page.evaluate(() => {
      return typeof window.jumper !== 'undefined' && window.jumper.isActive;
    });
    expect(isActive).toBe(true);
    
    const hasConfig = await page.evaluate(() => {
      return typeof window.jumper.config === 'object';
    });
    expect(hasConfig).toBe(true);
  });
});