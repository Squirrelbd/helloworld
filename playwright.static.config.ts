import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORTFOLIO_PORT ?? 4186);
const base = (process.env.PORTFOLIO_BASE ?? '').replace(/\/$/, '');
const url = 'http://127.0.0.1:' + port + base + '/';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/industrial-portfolio.spec.ts',
  outputDir: 'test-results/industrial',
  workers: 2,
  use: { ...devices['Desktop Chrome'], baseURL: url, trace: 'retain-on-failure' },
  webServer: { command: 'node tests/serve-static.mjs', url }
});
