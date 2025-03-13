import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    timeout: 30000,
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry failed tests 2 times on CI, 1 time locally */
    retries: process.env.CI ? 2 : 1,
    /* Opt out of parallel tests on CI, default is 3. */
    workers: process.env.CI ? 1 : 3,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'test-results' }]
    ],
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:300',
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        // screenshot: 'only-on-failure',
        // video: 'retain-on-failure',
        // trace: 'only-on-failure',
        launchOptions: {
          /* Slow down Playwright operations by the specified amount of milliseconds. */
          // slowMo: 1000
        }
    },

    /* Configure projects for common browsers */
    projects: [
      {
        name: 'chromium',
        use: { browserName: 'chromium', },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
  
      /* Test against mobile viewports. */
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
  
      /* Test against branded browsers. */
      // {
      //   name: 'Microsoft Edge',
      //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
      // },
      // {
      //   name: 'Google Chrome',
      //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      // },
    ]
});
