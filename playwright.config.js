// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list", { printSteps: true }],
    ["html"],
    ["@estruyf/github-actions-reporter"],
  ],
  use: {
    trace: "on-first-retry",
    video: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: "npx serve",
    url: "http://localhost:3000",
  },
});
