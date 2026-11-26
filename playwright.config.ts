import { defineConfig, devices } from '@playwright/test';

const base = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const port = Number(process.env.TEST_PORT ?? 4178);
const fixture = process.env.PORTFOLIO_FIXTURE === '1';

export default defineConfig({
  testDir: './tests',
  testMatch: fixture ? '**/fixture-projects.spec.ts' : '**/portfolio.spec.ts',
  outputDir: fixture ? 'test-results/fixtures' : 'test-results/portfolio',
  workers: 2,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:' + port + base + '/',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/serve-dist.mjs',
    url: 'http://127.0.0.1:' + port + base + '/',
    reuseExistingServer: false
  }
});
