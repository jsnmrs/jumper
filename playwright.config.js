// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
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
    // Enhanced timeout settings
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Better error reporting
    trace: "on-first-retry",
    video: "retain-on-failure", // Only keep videos on failure
    screenshot: "only-on-failure",

    // Wait for network to be idle before proceeding
    waitForLoadState: "networkidle",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: "npx serve",
    url: "http://localhost:3000",
    timeout: 120 * 1000, // 2 minutes timeout for server startup
    reuseExistingServer: !process.env.CI,
  },
});
