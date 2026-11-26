# Industrial IoT portfolio test report

Verification ran on 26 November 2026 in the local Windows checkout using Node 25.8.0, Playwright 1.65.1, Chromium 159, and axe-core. The application was served from its raw `docs/` files.

## Automated and manual checks

| Check | Evidence |
| --- | --- |
| ESLint | `npm run lint` exited successfully. |
| Static source | Two `npm run test:artifact` checks passed for section order, one-page routing, relative assets, and required hosting files. |
| Root hosting | 24 browser checks passed against `/`. |
| Project hosting | 24 browser checks passed against `/helloworld/` served by the local static test harness. |
| Accessibility | Axe returned zero violations in the configured homepage A/AA rules in both color modes at the tested desktop viewport. Keyboard disclosure and menu dismissal, focus restoration, touch navigation, reduced motion, and no-script behavior were checked separately. |
| Responsive layout | Verified no horizontal overflow at 320, 375, 390, 768, 1024, 1280, 1440, and 1920 px. Inspected desktop and mobile screenshots in light and dark modes. |
| Contact | Required fields, missing-address feedback and direct email configuration passed. Mocked provider rejection preserved input and a confirmed success cleared it. |
| Editorial assets | Browser fixtures verified a configured name, portrait, experience, education, credential and HTTPS social link. Tested missing image fallback, rejection of unsafe URLs, and PDF download via both the page and the compact navigation. |
| Hosting workflow | Parsed the manual workflow locally. Confirmed direct upload of `docs/` and scoped Pages and OIDC permissions. |

The functional suite exercised same-page case studies, category filters, project fragments, menu navigation, themes and saved selection, disabled storage, the conceptual SVG and mobile reading order, and custom 404 recovery. A focused follow-up confirmed active navigation and the back-to-top control at both URL mounts.

## Lighthouse lab measurements

Lighthouse 13.6.0 audited the homepage served by the loopback Python preview in headless Chrome 159, with the default mobile and desktop presets.

| Preset | Performance | Accessibility | Best practices | SEO | LCP | CLS | Total blocking time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 73 | 100 | 100 | 66 | 1.32 s | 0 | 1,534 ms |
| Desktop | 67 | 100 | 100 | 66 | 0.50 s | 0 | 1,108 ms |
| Mobile repeat | 69 | 100 | 100 | 66 | 1.07 s | 0 | 3,131 ms |
| Desktop repeat | 95 | 100 | 100 | 66 | 0.45 s | 0 | 138 ms |

Each initial trace transferred approximately 86 KiB. Both mobile runs reported a slow host CPU, and the initial traces recorded long tasks that Lighthouse could not attribute to a file. Mobile performance fell short of the 95 target and the two desktop scores varied substantially. The indexing directive accounts for the preview SEO audit failure.

## Remaining verification

- The hosted GitHub Pages URL, native email application launch, and real form provider remain untested. Contact and résumé checks used fixtures.
- Public identity, work history, qualifications, project evidence, social profiles, email and résumé are pending. Search indexing is disabled in this review version.
- Actual screen-reader compatibility, field INP, and browsers beyond Chromium were outside the executed checks. Automated axe results are limited to the tested rules and pages.

Screenshots and local audit artifacts are saved in `.test-output/industrial/`.
