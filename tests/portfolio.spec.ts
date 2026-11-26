import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('switches architecture stages with the keyboard', async ({ page }) => {
  await page.goto('./');
  const device = page.getByRole('button', { name: 'Device' });
  await device.focus();
  await page.keyboard.press('Enter');
  await expect(device).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Firmware validates, timestamps, and queues')).toBeVisible();
  await expect(page.locator('.telemetry-pulse')).toHaveCSS('animation-name', 'telemetry');
});

test('persists an explicit theme over system preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('keeps manual theme switching usable when storage fails', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Storage is unavailable', 'SecurityError'); }
    });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('supports the mobile menu and restores focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.click();
  const contact = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' });
  await expect(contact).toBeVisible();
  await contact.focus();
  await page.keyboard.press('Escape');
  await expect(contact).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await contact.click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(contact).toBeHidden();
});

test('opens a case study directly and refreshes it', async ({ page }) => {
  const response = await page.goto('./projects/telemetry-reference/');
  expect(response?.status()).toBe(200);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'From sensor to dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/#projects$/);
});

test('serves a real 404 and its recovery link', async ({ page }) => {
  const response = await page.goto('./projects/does-not-exist/');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Engineering from the edge.');
});

test('keeps reverse-tab focus clear of the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto('./');
  await page.getByRole('link', { name: 'Read case study: From sensor to dashboard' }).focus();
  const title = page.getByRole('link', { name: 'From sensor to dashboard', exact: true });
  await title.evaluate((link) => window.scrollBy({ top: link.getBoundingClientRect().top - 24, behavior: 'instant' }));
  await page.keyboard.press('Shift+Tab');
  await expect(title).toBeFocused();
  await expect.poll(() => title.evaluate((link) =>
    link.getBoundingClientRect().top - document.querySelector('header')!.getBoundingClientRect().bottom
  )).toBeGreaterThanOrEqual(0);
});

test('leaves a useful static diagram and navigation without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByText('Firmware validates, timestamps, and queues')).toBeVisible();
    await page.getByRole('link', { name: 'Explore my work' }).click();
    await expect(page).toHaveURL(/#projects$/);
  } finally {
    await context.close();
  }
});

test('reduces ambient motion when requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('button', { name: 'Device' }).click();
  await expect(page.locator('.telemetry-pulse').first()).toHaveCSS('animation-name', 'none');
});

for (const theme of ['light', 'dark'] as const) {
  test('has no WCAG A/AA axe violations in ' + theme, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('./');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
    if (process.env.CAPTURE_PREVIEWS === '1') {
      await page.screenshot({ path: '.test-output/previews/desktop-' + theme + '.png', fullPage: true, animations: 'disabled' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: '.test-output/previews/mobile-' + theme + '.png', fullPage: true, animations: 'disabled' });
    }
  });
}

for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
  test('fits the ' + width + 'px viewport', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
