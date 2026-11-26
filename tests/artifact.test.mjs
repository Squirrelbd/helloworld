import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const read = (name) => readFileSync(new URL('../dist/' + name, import.meta.url), 'utf8');
const base = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const origin = new URL(process.env.SITE_URL || 'https://squirrelbd.github.io').origin;

test('the production homepage has coherent discovery metadata and a static diagram', () => {
  const home = read('index.html');
  assert.match(home, /<title>[^<]+<\/title>/);
  assert.ok(home.includes('id="architecture"'));
  assert.ok(home.includes('rel="canonical" href="' + origin + base + '/"'));
  assert.ok(!home.includes('Synthetic test project'));
  assert.ok(!home.includes('test@example.invalid'));
  assert.ok(!home.includes('fixture-resume.pdf'));
});

test('the static 404 links back to the correct base', () => {
  assert.ok(read('404.html').includes('href="' + base + '/"'));
});

test('the sitemap and robots output agree on the build origin and base', () => {
  assert.ok(read('sitemap.xml').includes('<loc>' + origin + base + '/</loc>'));
  assert.ok(!read('sitemap.xml').includes('404'));
  assert.ok(read('robots.txt').includes('Sitemap: ' + origin + base + '/sitemap.xml'));
});

test('local route and asset references resolve within the mounted build', () => {
  const dist = resolve('dist');
  const pages = readdirSync(dist, { recursive: true }).filter((name) => name.endsWith('.html'));
  for (const name of pages) {
    const page = read(name.replaceAll('\\', '/'));
    for (const [, href] of page.matchAll(/\b(?:href|src|srcset)="(\/[^"\s]+)"/g)) {
      if (href.startsWith('//')) continue;
      const path = new URL(href, origin).pathname;
      assert.ok(path.startsWith(base + '/'), name + ' points outside the base: ' + href);
      const output = path.slice(base.length + 1);
      const file = resolve(dist, output.endsWith('/') || !output ? output + 'index.html' : output);
      assert.ok(statSync(file, { throwIfNoEntry: false })?.isFile(), name + ' references a missing file: ' + href);
    }
  }
});
