import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const dataModule = readFileSync('docs/assets/js/content.js', 'utf8');
async function configure(page: Page, changes: string) {
  await page.route('**/assets/js/content.js', (route) => route.fulfill({
    status: 200, contentType: 'text/javascript', body: dataModule + '\n' + changes
  }));
}

test('loads the complete portfolio with the portrait and reviewed résumé', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('#hero-intro')).toContainText('embedded hardware and firmware');
  await expect(page.getByRole('heading', { name: 'Embedded hardware' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Embedded firmware' })).toBeVisible();
  for (const title of ['About me', 'Engineering expertise', 'Work experience', 'Featured projects', 'Engineering services', 'Résumé / CV', 'Let’s connect.']) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await expect(page.locator('.project-card')).toHaveCount(3);
  const currentRole = page.locator('#experience-list > li').first();
  await expect(currentRole.getByRole('heading', { name: 'Senior Embedded Systems Engineer' })).toBeVisible();
  await expect(currentRole.getByText('B-Trac Solutions Ltd.', { exact: true })).toBeVisible();
  expect(await currentRole.evaluate((role) => getComputedStyle(role, '::before').content)).toBe('""');
  expect(await currentRole.locator('.tags > li').evaluateAll((tags) =>
    tags.map((tag) => getComputedStyle(tag, '::before').content)
  )).toEqual(['none', 'none', 'none', 'none', 'none']);
  await expect(page.locator('#projects + #services')).toHaveCount(1);
  const portrait = page.getByRole('img', { name: 'Portrait of Md. Amirul Islam' });
  await expect(portrait).toHaveJSProperty('naturalWidth', 576);
  await expect(page.locator('#portrait')).toHaveClass(/has-image/);
  await expect(page.getByRole('link', { name: 'View PDF' })).toHaveAttribute('href', './assets/files/md-amirul-islam-resume.pdf');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('md-amirul-islam-resume.pdf');
  expect(readFileSync(await download.path())).toEqual(readFileSync('docs/assets/files/md-amirul-islam-resume.pdf'));
  await expect(page.locator('#hero-socials').getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/Squirrelbd');
  const expertise = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Expertise' });
  await expertise.click();
  await expect(expertise).toHaveAttribute('aria-current', 'location');
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect(page).toHaveURL(/#home$/);
  expect(errors).toEqual([]);
});

test('uses native expandable case studies and category filters on the same page', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Industrial IoT', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  const summary = page.locator('summary[aria-label="View case study: Industrial IoT gateway"]');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Contribution' })).toBeVisible();
  await expect(page).not.toHaveURL(/\/projects\//);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Contribution' })).toBeHidden();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(3);
  await page.goto('./#project-cold-chain-monitoring');
  await expect(page.locator('#project-cold-chain-monitoring details')).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Industrial IoT', exact: true }).click();
  await page.getByRole('link', { name: 'Case study: Cold-chain temperature monitoring' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#project-cold-chain-monitoring details')).toBeVisible();
});

test('opens and closes the compact navigation on a touch viewport', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const menu = page.getByRole('button', { name: 'Menu' });
    const contact = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' });
    await menu.tap();
    await expect(contact).toBeVisible();
    await contact.focus();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(contact).toBeHidden();
    await menu.tap();
    await contact.tap();
    await expect(page).toHaveURL(/#contact$/);
    await expect(contact).toBeHidden();
    await expect(page.locator('#contact')).toBeFocused();
  } finally { await context.close(); }
});

test('follows system theme until a persisted manual selection is made', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('switches the active theme with storage unavailable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Unavailable'); } });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('retains anchors, hero message, and a legible diagram without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark', viewport: { width: 375, height: 812 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Connecting machines');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 17, 32)');
    await expect(page.getByRole('list', { name: 'Industrial IoT data flow' })).toBeVisible();
    await page.getByRole('link', { name: 'Explore projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.getByRole('link', { name: 'Download résumé' })).toBeVisible();
    await expect(page.locator('#contact').getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await expect(page.locator('#contact-form')).toBeHidden();
  } finally { await context.close(); }
});

test('honors reduced motion on the hero graph', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.packet')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
});

async function fillForm(page: Page) {
  await page.getByLabel('Full name').fill('Test visitor');
  await page.getByLabel('Email', { exact: true }).fill('test@example.invalid');
  await page.getByLabel('Subject').fill('Local test');
  await page.getByLabel('Message', { exact: true }).fill('Fixture that stays inside the test browser.');
}

test('uses LinkedIn and hides the form when there is no public email or provider', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#contact-form')).toBeHidden();
  await expect(page.locator('#contact').getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/mdamirul/');
  await expect(page.getByRole('link', { name: 'Email directly' })).toHaveCount(0);
});

test('validates the contact form when a public address is configured', async ({ page }) => {
  await configure(page, "content.contact.email = 'portfolio@example.invalid';");
  await page.goto('./');
  const submit = page.getByRole('button', { name: 'Open email draft' });
  await submit.click();
  await expect(page.locator('#contact-status')).toContainText('Check the highlighted field');
  await fillForm(page);
  await expect(page.getByLabel('Subject')).toHaveValue('Local test');
});

test('renders the direct email fallback with accurate draft instructions', async ({ page }) => {
  await configure(page, "content.contact.email = 'portfolio@example.invalid';");
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Email directly' })).toHaveAttribute('href', 'mailto:portfolio@example.invalid');
  await expect(page.getByRole('button', { name: 'Open email draft' })).toBeVisible();
  await expect(page.locator('#contact-mode')).toContainText('prepares a draft');
});

test('reports provider failure and accepts only a confirmed mocked submission', async ({ page }) => {
  await configure(page, "content.contact = {mode:'provider', endpoint:'https://forms.example.invalid/contact'};");
  let succeed = false;
  await page.route('https://forms.example.invalid/contact', (route) => route.fulfill({
    status: 200, headers: { 'Access-Control-Allow-Origin': '*' }, json: { ok: succeed }
  }));
  await page.goto('./');
  await fillForm(page);
  const submit = page.getByRole('button', { name: 'Send message' });
  await submit.click();
  await expect(page.locator('#contact-status')).toContainText('could not be confirmed');
  await expect(page.getByLabel('Subject')).toHaveValue('Local test');
  succeed = true;
  await submit.click();
  await expect(page.locator('#contact-status')).toContainText('confirmed your message');
  await expect(page.getByLabel('Subject')).toHaveValue('');
});

test('downloads a configured PDF and excludes invalid socials and missing images', async ({ page }) => {
  await configure(page, "content.resume.path = 'assets/files/fixture.pdf'; content.socials.push({label:'Unsafe',url:'javascript:void(0)'}); content.projects[0].image = {path:'assets/images/missing.webp',alt:'Missing project photo'};");
  await page.route('**/assets/files/fixture.pdf', (route) => route.fulfill({
    status: 200, contentType: 'application/pdf', body: '%PDF-1.4\n%%EOF'
  }));
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Unsafe' })).toHaveCount(0);
  await expect(page.locator('#project-production-monitoring .project-art svg')).toBeVisible();
  const promise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé' }).click();
  expect((await promise).suggestedFilename()).toBe('fixture.pdf');
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Résumé', exact: true }).click();
  await expect(page).toHaveURL(/#resume$/);
  await expect(page.locator('#resume')).toBeFocused();
  const mobileDownload = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé' }).click();
  expect((await mobileDownload).suggestedFilename()).toBe('fixture.pdf');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('renders configured editorial fields and a valid portrait', async ({ page }) => {
  await configure(page, `content.profile.name = 'Fixture name';
    content.profile.portrait = {path:'assets/images/mark.svg', alt:'Fixture portrait', width:64, height:64};
    content.experience = [{title:'Fixture position', organization:'Fixture organization', projectIds:['production-monitoring']}];
    content.socials = [{label:'Fixture profile',url:'https://example.invalid/profile'}];`);
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Fixture name', exact: true })).toHaveCount(2);
  await expect(page.getByRole('img', { name: 'Fixture portrait' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fixture position' })).toBeVisible();
  await expect(page.getByText('Fixture organization', { exact: true })).toBeVisible();
  await expect(page.locator('#footer-socials a')).toHaveAttribute('href', 'https://example.invalid/profile');
});

test('serves a custom 404 with a recovery path at the configured mount', async ({ page }) => {
  const response = await page.goto('./missing/nested/');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Return to the portfolio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Connecting machines');
});

test('offers the canonical recovery link from a nested 404 without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    expect((await page.goto(new URL('missing/nested/', baseURL!).href))?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'Return to the portfolio' })).toHaveAttribute('href', 'https://squirrelbd.github.io/helloworld/');
  } finally { await context.close(); }
});

for (const theme of ['light','dark'] as const) {
  test('checks homepage accessibility in ' + theme + ' mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('.project-card')).toHaveCount(3);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(report.violations.map(({ id, nodes }) => ({ id, selectors: nodes.map((node) => node.target) }))).toEqual([]);
    if (process.env.PORTFOLIO_CAPTURES === '1') {
      await page.screenshot({ path: '.test-output/industrial/desktop-' + theme + '.png', fullPage: true, animations: 'disabled' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: '.test-output/industrial/mobile-' + theme + '.png', fullPage: true, animations: 'disabled' });
    }
  });
}

for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
  test('fits ' + width + 'px without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width, height: 920 });
    await page.goto('./');
    await expect(page.locator('.project-card')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
