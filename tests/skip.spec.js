// @ts-check
const { test, expect } = require("@playwright/test");

test("should focus main element after skip link via keyboard", async ({
  page,
}) => {
  const skipLinkClass = ".skip";
  await page.goto("http://localhost:3000");
  await expect(page.locator("body")).toHaveClass(/has-jumper/);

  // Get skip link
  const skipLink = page.locator(skipLinkClass);

  // Confirm the skip link is not visible (optional)
  await expect(skipLink).toBeHidden;

  // Press Tab once to focus the first interactive element on the page
  await page.keyboard.press("Tab");

  // Ensure the skip link is focused and visible
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  // Get skip link target
  const skipTarget = await skipLink.getAttribute("href");

  // Activate skip link by pressing Enter
  await page.keyboard.press("Enter");

  // Ensure the skip link is not focused
  await expect(skipLink).not.toBeFocused();

  // Ensure the body is not focused
  await expect(page.locator("body")).not.toBeFocused();

  // Ensure the skip link target is focused and visible
  if (skipTarget) {
    await expect(page.locator(skipTarget)).toBeFocused();
    await expect(page.locator(skipTarget)).toBeVisible();
  }
});

test("should focus a#skip8 after skip link via keyboard", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("body")).toHaveClass(/has-jumper/);

  // Ensure the body is focused
  await expect(page.locator("body")).toBeFocused();

  // Press Tab nine times to reach skip8 link
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  // Expects page to have a link with the name of Test #skip8... that is focused.
  await expect(
    page.getByRole("link", {
      name: "Test #skip8, to <a> element",
      exact: true,
    }),
  ).toBeFocused();

  // Activate skip link by pressing Enter
  await page.keyboard.press("Enter");

  // Ensure the body is not focused
  await expect(page.locator("body")).not.toBeFocused();

  // Ensure the skip link target is focused and visible
  if (page.locator("id=skip8")) {
    await expect(page.locator("id=skip8")).toBeFocused();
    await expect(page.locator("id=skip8")).toBeVisible();
  }
});

test("should focus #skip1 after skip link via keyboard", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("body")).toHaveClass(/has-jumper/);

  // Ensure the body is focused
  await expect(page.locator("body")).toBeFocused();

  // Press Tab three times to reach skip1 link
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  // Expects page to have a link with the name of Test #skip1 that is focused.
  await expect(
    page.getByRole("link", { name: "Test #skip1", exact: true }),
  ).toBeFocused();

  // Activate skip link by pressing Enter
  await page.keyboard.press("Enter");

  // Ensure the body is not focused
  await expect(page.locator("body")).not.toBeFocused();

  // Ensure the skip link target is focused and visible
  if (page.locator("id=skip1")) {
    await expect(page.locator("id=skip1")).toHaveAttribute("tabindex", "-1");
    await expect(page.locator("id=skip1")).toBeFocused();
    await expect(page.locator("id=skip1")).toBeVisible();
  }
});
