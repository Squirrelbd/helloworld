# Industrial IoT Portfolio Implementation Plan

**Status** — Implemented locally and tested at both hosting paths. Publication and actual personal content remain pending.

**Goal** — Show the engineer's work across industrial automation, production monitoring, embedded devices, and IoT platforms in a single responsive portfolio.

## Architecture and repository

Publish the static files in `docs/`. GitHub Pages can serve that directory directly from the release branch. The website uses HTML, CSS, vanilla ES modules, and SVG. Python can serve it for local review. Playwright, axe, and Lighthouse run separately as optional development tools. The prior Astro source stays in the checkout as a reference. It sits outside the new hosting directory.

| Path | Role |
| --- | --- |
| `docs/index.html` | All portfolio sections, anchor navigation, critical text and metadata, and the machine-to-insight diagram |
| `docs/assets/css/` | Semantic tokens for both themes, responsive layout, component styling, focus, and motion |
| `docs/assets/js/content.js` | Editable profile, expertise, background, projects, services, assets, and contact options |
| `docs/assets/js/` | Theme, safe DOM rendering, filtering, contact, and navigation behavior |
| `docs/404.html`, `docs/robots.txt`, `docs/sitemap.xml`, `docs/.nojekyll` | Static hosting and discovery files |
| `tests/` | Local verification for the new static site, including tests at root and project paths |
| `README.md`, `CONTENT_GUIDE.md`, `TEST_REPORT.md` | Preview and deployment instructions, editorial guide, and actual verification evidence |

## Design and information hierarchy

Use the supplied visual as a layout reference. Start with a slate and blue-teal palette, a compact sticky header, strong editorial type, and a split hero with visibly connected engineering nodes. Use a light theme with its own surface and contrast tokens. Move from the hero into About, expertise, experience, featured projects, education, certifications and achievements, services, résumé, contact, and the footer. Keep education and credentials distinct while pairing them on wider screens. On phones, stack the hero and invert the topology into a compact vertical reading sequence. Use a timeline for experience and visibly differentiated engineering diagrams for project cards.

The hero's SVG and text explain the conceptual path from machines and sensors through controllers, communications, edge, IoT platform, monitoring, and operational insight. Use a brief moving packet and accent the downstream platform and insight nodes. Use gentle, bounded entrances and interaction transitions with reduced-motion support and visible content when scripts are unavailable.

## Content and behavior

Use centralized placeholders for unconfirmed identity or experience. Show illustrative technical domains and three illustrative project concepts with visible provenance. Include project descriptions, categories, technical tags, and inline native disclosures for case studies. Offer filters when the case collection warrants them. Keep essential positioning, landmarks, anchors, and fallback text in HTML. Document the few static metadata or branding fields that also need updating.

Use the engineering résumés for the byline, biography, work history, education, expertise, and professional profiles. The local preview includes the owner-supplied portrait, the reviewed public résumé, and the corrected BDRO and IRO mentoring credit. Its project summaries cover production monitoring, cold-chain telemetry, and equipment integration. Describe collaboration in terms of demonstrated capabilities. Use LinkedIn for inquiries while a public email address or form provider is unspecified. Confirm case-study details before public release.

Use system preferences and localStorage for theme, with an in-memory fallback. Manage mobile menu focus, Escape dismissal, active anchors, and keyboard and touch interactions. Pending résumés and socials have explanatory states. Optional links and visual assets are validated before rendering. The contact form validates locally, prepares a message in the visitor's email app once a public address is configured, and supports an approved HTTPS form service as an optional mode.

## Verification and deployment

Keep timeline markers scoped to experience entries. Separate role, employer, and dates visually, wrap technology tags on narrow screens, and label links from experience to project case studies.

Keep the existing palette and layout while improving card spacing, project controls, résumé navigation, and the LinkedIn contact action. Present embedded hardware and firmware explicitly in the profile, expertise, and service descriptions.

Aim for WCAG 2.2 AA, 95+ Lighthouse category targets, LCP ≤ 2.5 s, CLS ≤ 0.1, and INP ≤ 200 ms where field data is available. Use semantic landmarks, readable contrast, native disclosures and controls, visible focus, bounded motion, and the smallest practical payload. Validate all mandatory sections, themes, disclosable case studies, menus, filtering, contact and résumé states, missing assets, and no-script fallback. Exercise 320, 375, 390, 768, 1024, 1280, 1440, and 1920 px. Inspect actual desktop and mobile views and record what ran. Confirm static assets, anchors, sitemap, metadata, and 404 behavior under both URL mounts.

Document branch-based Pages publishing from `/docs` and optional direct static upload. The provisional canonical is `https://squirrelbd.github.io/helloworld/`. Keep preview indexing disabled until confirmed public copy and destination are ready. Public deployment, remote changes, and external form registration require separate authorization.

## Milestones

- [x] Inspect the existing project, the new brief, and the reference visual.
- [x] Implement the static shell, responsive design system, and both themes.
- [x] Implement every portfolio section and centralized illustrative content.
- [x] Verify the native interactions, accessibility, responsive layout, and static URL mounts.
- [x] Prepare the direct Pages workflow and deliver the content guide, test report, and local preview.
- [ ] Add approved personal content and verify it at the authorized release destination.

See [TEST_REPORT.md](TEST_REPORT.md) for executed checks, Lighthouse results, and remaining limitations.
