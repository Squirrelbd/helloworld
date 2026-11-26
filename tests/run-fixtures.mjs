import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const output = resolve('.test-output');
mkdirSync(output, { recursive: true });
const workspace = mkdtempSync(resolve(output, 'fixture-'));

for (const file of ['astro.config.mjs', 'package.json', 'tsconfig.json', 'src', 'public']) {
  cpSync(resolve(root, file), resolve(workspace, file), { recursive: true });
}
symlinkSync(resolve(root, 'node_modules'), resolve(workspace, 'node_modules'), 'junction');

const profileFile = resolve(workspace, 'src/content/profile.ts');
const profileSource = readFileSync(profileFile, 'utf8');
writeFileSync(profileFile, profileSource.slice(0, profileSource.indexOf('export const profile')) + `
export const profile: Profile = {
  name: 'Test-only engineer',
  title: 'Synthetic role',
  bio: 'Synthetic biography for local verification.',
  expertise: [{ title: 'Firmware', description: 'Synthetic skill description', technologies: ['Test technology'] }],
  experience: [{
    organization: 'Test organisation',
    position: 'Test engineer',
    period: '2020–2022',
    summary: 'Synthetic employment entry.',
    projectSlugs: ['fixture-1', 'fixture-draft']
  }],
  education: [{ institution: 'Test institution', qualification: 'Synthetic degree' }],
  services: [{ title: 'Test service', description: 'Synthetic service description.' }],
  socials: [],
  email: 'test@example.invalid',
  resume: 'fixture-resume.pdf',
  contactEndpoint: 'https://contact.example.invalid/portfolio',
  seo: { title: 'Test portfolio', description: 'Synthetic test profile', image: 'circuit-board.webp', indexable: false }
};
`);
const pdf = '%PDF-1.4\n';
const objects = [
  '<</Type /Catalog /Pages 2 0 R>>',
  '<</Type /Pages /Kids [3 0 R] /Count 1>>',
  '<</Type /Page /Parent 2 0 R /MediaBox [0 0 72 72]>>'
];
const body = objects.map((object, index) => (index + 1) + ' 0 obj\n' + object + '\nendobj\n');
let offset = pdf.length;
const xref = body.map((chunk) => {
  const entry = String(offset).padStart(10, '0') + ' 00000 n \n';
  offset += chunk.length;
  return entry;
});
writeFileSync(resolve(workspace, 'public/fixture-resume.pdf'), pdf + body.join('') +
  'xref\n0 4\n0000000000 65535 f \n' + xref.join('') +
  'trailer\n<</Root 1 0 R /Size 4>>\nstartxref\n' + offset + '\n%%EOF\n');
for (let number = 1; number <= 5; number++) {
  const draft = number === 5;
  const slug = draft ? 'fixture-draft' : 'fixture-' + number;
  writeFileSync(resolve(workspace, 'src/content/projects', slug + '.md'), `---
slug: ${slug}
title: Synthetic test project ${number}
summary: Training data for the local fixture only.
category: ${number < 3 ? 'Firmware' : 'Hardware'}
stages: [device]
draft: ${draft}
image:
  path: missing-fixture.webp
  alt: Synthetic image
  width: 640
  height: 320
---

## Fixture content

This content only exists in the isolated test source.
`);
}

const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
  PORTFOLIO_FIXTURE: '1',
  SITE_BASE: '/helloworld',
  TEST_DIST: resolve(workspace, 'dist'),
  TEST_PORT: '4179'
};
const astroPackage = JSON.parse(readFileSync(resolve(root, 'node_modules/astro/package.json'), 'utf8'));
const build = spawnSync(process.execPath, [resolve(root, 'node_modules/astro', astroPackage.bin.astro), 'build'], {
  cwd: workspace, env, stdio: 'inherit'
});
if (build.status !== 0) process.exit(build.status ?? 1);
const testRun = spawnSync(process.execPath, [resolve(root, 'node_modules/@playwright/test/cli.js'), 'test', 'fixture-projects.spec.ts'], {
  cwd: root, env, stdio: 'inherit'
});
process.exit(testRun.status ?? 1);
