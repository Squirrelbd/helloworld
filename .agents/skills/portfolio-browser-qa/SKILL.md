---
name: portfolio-browser-qa
description: Verify this portfolio in a browser for responsive layout, accessibility, theme behavior, navigation, and project or contact interactions.
---

# Portfolio browser QA

1. Serve the production build locally. Exercise user flows in the shipped build and ask the Pages skill to verify any deployment-path assumptions.
2. Inspect the brief's viewport range from 320 to 2560 pixels. Capture representative mobile and desktop screens in both themes. Check keyboard focus, menu dismissal, anchor offsets, theme persistence, and reduced motion.
3. Exercise project filters and direct case-study URLs, the custom 404, and configured resume and contact controls. Use a fixture or interception for contact form checks unless a real submission is authorized.
4. Combine automated accessibility checks with manual keyboard and contrast checks. Record the build, browser, URL, viewport, tool settings, observed failures, and any checks blocked by missing content or tooling.
