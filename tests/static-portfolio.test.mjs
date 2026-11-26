import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const directory = new URL('../docs/', import.meta.url);
const read = (path) => readFileSync(new URL(path, directory), 'utf8');

test('delivers all portfolio sections on one HTML page', () => {
  const html = read('index.html');
  const order = ['home', 'about', 'expertise', 'experience', 'projects', 'education', 'credentials', 'services', 'resume', 'contact'];
  let previous = -1;
  for (const id of order) {
    const current = html.indexOf('id="' + id + '"');
    assert.ok(current > previous, 'Missing or out-of-order section ' + id);
    previous = current;
  }
  assert.ok(!html.includes('/projects/'));
  assert.doesNotMatch(html, /<meta name="(?:robots|googlebot)"[^>]*content="[^"]*\bnoindex\b/i);
  assert.match(read('404.html'), /<meta name="robots" content="noindex"/);
});

test('distributes raw static files with portable entry asset paths', () => {
  const html = read('index.html');
  for (const [, path] of html.matchAll(/(?:href|src)="(\.\/assets\/[^"]+)"/g)) {
    assert.ok(existsSync(new URL(path, directory)), 'Missing relative asset ' + path);
  }
  for (const path of ['404.html', '.nojekyll', 'robots.txt', 'sitemap.xml', 'assets/js/content.js']) {
    assert.ok(existsSync(new URL(path, directory)), 'Missing static deliverable ' + path);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith('https://'));
  assert.ok(read('sitemap.xml').includes('<loc>' + canonical + '</loc>'));
  assert.ok(read('robots.txt').includes('Sitemap: ' + canonical + 'sitemap.xml'));
});
