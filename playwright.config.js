// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const env = require('./config/env');

/**
 * Chromium launch flags - mirror of the cypress-side `before:browser:launch` hook.
 * Stabilises Chromium in Docker / CI containers and prevents cache from
 * interfering with network interception across specs.
 */
const chromiumLaunchArgs = [
  '--disable-dev-shm-usage', // /dev/shm is tiny in Docker -> use /tmp
  '--no-sandbox', // required in many Linux CI containers
  '--disable-gpu', // GPU instability in headless runs
  '--disable-extensions', // deterministic browser session
  '--disable-background-timer-throttling', // keep timers honest in bg tabs
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--disable-ipc-flooding-protection',
  '--disable-application-cache',
  '--disable-cache',
  '--disk-cache-size=1',
  '--media-cache-size=1',
];

module.exports = defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: env.uiBaseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 800 },

    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: chromiumLaunchArgs },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
