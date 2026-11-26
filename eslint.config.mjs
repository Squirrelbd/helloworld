import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', '.astro/**', '.test-output/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: ['**/*.ts'] })),
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.mjs'],
    languageOptions: { globals: { URL: 'readonly', process: 'readonly' } }
  },
  {
    files: ['**/*.astro'],
    rules: { 'no-undef': 'off' }
  },
  {
    files: ['docs/assets/js/**/*.js'],
    languageOptions: {
      globals: Object.fromEntries([
        'document', 'window', 'location', 'matchMedia', 'localStorage', 'Node', 'IntersectionObserver',
        'scrollY', 'innerHeight', 'requestAnimationFrame', 'setTimeout', 'clearTimeout',
        'URL', 'HTMLInputElement', 'HTMLTextAreaElement', 'fetch', 'FormData', 'AbortSignal'
      ].map((name) => [name, 'readonly']))
    }
  }
];
