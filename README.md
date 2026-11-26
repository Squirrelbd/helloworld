# Industrial IoT engineering portfolio

A single-page engineering portfolio for industrial automation, production monitoring, connected devices, and embedded systems. The website is plain HTML, CSS, JavaScript, and SVG. Its complete hosting directory is `docs/`.

## Run locally

From the repository root, run the following with Python 3.

```sh
python -m http.server 4321 --bind 127.0.0.1 --directory docs
```

Open [the local portfolio](http://127.0.0.1:4321/). The page uses native JavaScript modules, so serve it over HTTP. Any basic static web server works. Optional npm tooling in the repository supports verification and the historical implementation.

## Repository layout

| Path | Purpose |
| --- | --- |
| `docs/index.html` | Homepage sections, essential copy, inline industrial topology, and social metadata |
| `docs/assets/css/` | Theme variables, component styles, responsive layouts, and motion |
| `docs/assets/js/content.js` | Public profile, projects, contact and résumé configuration |
| `docs/assets/js/` | Rendering, theme, filters, menu, and contact interaction |
| `docs/assets/images/` and `docs/assets/fonts/` | Local graphics, brand font, and license |
| `docs/404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll` | Files under the static hosting directory |
| `tests/industrial-portfolio.spec.ts` and `playwright.static.config.ts` | Browser and accessibility checks |
| `.github/workflows/deploy.yml` | Optional manual workflow that uploads the static directory |
| `src/`, `public/`, and `legacy:*` scripts | Earlier Astro implementation kept for reference outside the hosting directory |

See [the content guide](CONTENT_GUIDE.md) for examples, [the implementation plan](PLAN.md) for scope, and [the test report](TEST_REPORT.md) for executed checks.

## Prepare the release

1. Replace the marked identity and biography placeholders. Replace or hide illustrative projects and confirm which services and expertise can be advertised publicly.
2. Add the approved contact email and social URLs. Keep `contact.mode` set to `email` to prepare drafts in the visitor's mail app. An approved HTTPS service is optional and can be configured later.
3. Add a public résumé PDF to `docs/assets/files/resume.pdf` and set `resume.path` to `assets/files/resume.pdf`. The download only appears if the path serves a PDF.
4. Review the title, description, canonical, sharing image, and sitemap against the final destination. The homepage allows indexing. The recovery page retains its `noindex` directive.

## Publish on GitHub Pages

For branch publishing, place `docs/` in the authorized publishing branch. Go to **Settings → Pages → Deploy from a branch**, select that branch and **/docs**, then save. The included `.nojekyll` selects direct static publishing. Alternatively, choose **GitHub Actions** and run the manual static workflow from the approved branch. Use one publishing source. [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

The same relative asset paths work at `https://USERNAME.github.io/` and `https://USERNAME.github.io/REPOSITORY/`. Set the absolute metadata URLs to the final address and update the project base in `docs/404.html` if it changes. For a dedicated custom domain, follow the Pages custom domain and DNS setup for the repository, then update all absolute metadata URLs. [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Troubleshooting

- A blank project showcase when opening the HTML from disk usually means the browser blocked module loading. Use the HTTP preview command.
- If port 4321 is busy, choose another loopback port in the Python command and open that URL.
- If a photo or résumé is absent, verify the configured path, file type, and filename case. Match the names under `docs/assets/`.
- If a draft does not open, check the device's default email handler. The direct email link remains available when a public address is configured.
- An unverified provider response will show a failure message. Test with the provider's documented CORS and JSON response contract before enabling it.

## Optional verification

Run `npm ci` and `npx playwright install chromium` to set up the existing test tools. Then run `npm test`. For a project-site simulation, set `PORTFOLIO_BASE=/helloworld` before running `npm run test:e2e`. The website files can be previewed and published independently of this toolchain.

The browser suite includes checks against the supplied illustrative content. Update the project, heading, and asset expectations when replacing the sample portfolio copy.
