import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:3001',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn dev --port 3001',
    port: 3001,
    reuseExistingServer: !process.env.CI,
  },
});
