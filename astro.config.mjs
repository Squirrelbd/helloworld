import { defineConfig } from 'astro/config';

const origin = new URL(process.env.SITE_URL || 'https://squirrelbd.github.io');
const base = (process.env.SITE_BASE ?? '').replace(/\/$/, '');

if (!['https:', 'http:'].includes(origin.protocol) || origin.href !== origin.origin + '/') {
  throw new Error('SITE_URL must be an HTTP or HTTPS origin without a path.');
}
if (base && !/^\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+$/i.test(base)) {
  throw new Error('SITE_BASE must be empty or a slash-prefixed path.');
}

export default defineConfig({
  site: origin.origin,
  base: base || '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false }
});
