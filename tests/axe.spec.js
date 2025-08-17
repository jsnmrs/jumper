// @ts-check
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("should not have any axe-core errors", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags([
      "ACT",
      "TTv5",
      "wcag2a",
      "wcag2aa",
      "wcag2aaa",
      "wcag21a",
      "wcag21aa",
      "wcag21aaa",
      "wcag22a",
      "wcag22aa",
      "wcag22aaa",
      "section508",
      "EN-301-549",
      "best-practice",
      "experimental",
    ])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
