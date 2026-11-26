import { expect, test } from '@playwright/test';

test.skip(process.env.PORTFOLIO_FIXTURE !== '1', 'Use npm run test:fixtures to build isolated synthetic content.');

test('renders approved fixture fields, filters cards, and leaves drafts outside the site', async ({ page, request }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Test-only engineer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education & credentials' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
  await page.getByRole('button', { name: 'Device' }).click();
  await expect(page.locator('#architecture').getByRole('link', { name: 'Synthetic test project 1 ↗' })).toBeVisible();
  const showcase = page.locator('#projects');
  await expect(showcase.locator('article:visible')).toHaveCount(5);
  await showcase.getByRole('button', { name: 'Firmware' }).click();
  await expect(showcase.locator('article:visible')).toHaveCount(2);
  await expect(showcase.getByRole('status')).toHaveText('Showing 2 case studies.');
  await showcase.getByRole('button', { name: 'All' }).click();
  await expect(showcase.locator('article:visible')).toHaveCount(5);
  await showcase.getByRole('link', { name: 'Read case study: Synthetic test project 1' }).click();
  await expect(page.getByRole('heading', { name: 'Synthetic test project 1' })).toBeVisible();
  await expect(page.locator('.case-media img')).toHaveCount(0);
  const draft = await request.get('./projects/fixture-draft/');
  expect(draft.status()).toBe(404);
  const sitemap = await request.get('./sitemap.xml');
  expect(await sitemap.text()).not.toContain('fixture-draft');
});

test('downloads the configured résumé from the project base', async ({ page }) => {
  await page.goto('./');
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé' }).click();
  expect((await download).suggestedFilename()).toBe('fixture-resume.pdf');
});

test('validates the form, retains input on failure, then clears it on success', async ({ page }) => {
  let submissions = 0;
  let shouldSucceed = false;
  let releaseResponse: (() => void) | undefined;
  await page.route('https://contact.example.invalid/portfolio', async (route) => {
    submissions++;
    await new Promise<void>((resolve) => { releaseResponse = resolve; });
    await route.fulfill({
      status: shouldSucceed ? 200 : 422,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: 'application/json',
      body: '{}'
    });
  });

  await page.goto('./');
  const form = page.locator('.contact-form');
  const submit = form.getByRole('button', { name: 'Send message' });
  await submit.click();
  await expect(form.locator(':invalid').first()).toBeVisible();
  expect(submissions).toBe(0);
  await form.getByLabel('Name').fill('Synthetic visitor');
  await form.getByLabel('Email').fill('visitor@example.invalid');
  await form.getByLabel('Subject').fill('Test message');
  await form.getByRole('textbox', { name: 'Message', exact: true }).fill('An intercepted message from the local test.');
  await submit.click();
  await expect(form.getByRole('status')).toHaveText('Sending your message…');
  await expect(submit).toBeDisabled();
  await expect(form.getByLabel('Subject')).toBeDisabled();
  await expect.poll(() => submissions).toBe(1);
  releaseResponse?.();
  await expect(form.getByRole('status')).toContainText('could not be sent');
  await expect(form.getByLabel('Subject')).toHaveValue('Test message');
  shouldSucceed = true;
  await submit.click();
  await expect.poll(() => submissions).toBe(2);
  releaseResponse?.();
  await expect(form.getByRole('status')).toContainText('Your message was sent');
  await expect(form.getByLabel('Subject')).toHaveValue('');
});
