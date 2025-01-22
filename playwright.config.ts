import { BASE_URL } from './src/env.config'
import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./src/global-setup.ts'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    actionTimeout: 0,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iphone',
      timeout: 50_000,
      use: { ...devices['iPhone 12 Mini'], baseURL: BASE_URL },
    },
    {
      name: 'smoke',
      testDir: './tests/smoke',
    },
    {
      name: 'test grep @GAD-R01-01 & @GAD-R01-03',
      grep: /@GAD-R01-01|@GAD-R01-03/,
    },
  ],
})
