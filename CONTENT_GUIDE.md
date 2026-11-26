# Edit the industrial IoT portfolio

Editable content lives in `docs/assets/js/content.js`. Open the file as text and save after replacing the values between quotes. Preview in an HTTP server after each edit. Use only facts and assets approved for public release.

## Personal details and About

| Field | How to fill it |
| --- | --- |
| `profile.name` | Replace `YOUR_FULL_NAME` with the name to display in the header and footer. |
| `profile.title` | Enter the public designation, for example an approved engineering job title. |
| `profile.tagline` | Update the `lead` and `accent` phrases. These render as one headline. |
| `profile.introduction` | Give a short explanation of the engineering work and audience. |
| `profile.biography`, `profile.about`, `profile.location`, `profile.phone` | Describe the verified background, approach, current focus, goals, and public location. Add a telephone number only when approved for publishing. |
| `profile.portrait` | Copy a public-ready photo under `docs/assets/images/`. Set the relative `path`, descriptive `alt`, original `width`, and original `height`. |
| `socials` | Set valid public HTTPS links for GitHub, LinkedIn, or other platforms. Unconfigured links are omitted. |

Also update the plain-HTML name, title, introduction, and tagline in `docs/index.html` so the updated identity appears in the static fallback.

## Engineering background

- **Expertise.** Replace the example focus areas in `expertise` with approved entries. Each has a `title`, `description`, and optional `technologies` array. Keep `illustrative: true` on any content used solely for layout review.
- **Experience.** Add entries in display order. Each can contain `title`, `organization`, `organizationLogo`, `period`, `location`, `employmentType`, `overview`, `responsibilities`, `contributions`, `solutions`, `technologies`, `projectIds`, and `achievements`.
- **Education.** Add an `institution`, `qualification`, `field`, `duration`, `location`, and optional `coursework`, `thesis`, `research`, and `achievements`.
- **Certifications and achievements.** Use separate `certifications` and `achievements` arrays. Optional properties include `issuer`, `issued`, `expires`, `domain`, `credentialId`, `verificationUrl`, `image`, and `description`. Publish a credential ID only when it is intended to be public.
- **Services.** Replace proposed entries with approved `title`, `description`, `capabilities` (an array), and `problems` values. Use `machine`, `pulse`, `network`, `chip`, `platform`, or `prototype` for the optional `icon` field in service and expertise cards. The action links to the contact section.

For example, a new experience entry has this shape. Replace the writing prompts with verified details before publishing.

```js
{ title: 'YOUR_JOB_TITLE', organization: 'YOUR_COMPANY_NAME',
  period: 'YOUR_DATES', overview: 'YOUR_ROLE_OVERVIEW',
  contributions: [], technologies: [], projectIds: [] }
```

## Projects and inline case studies

Add one approved object to `projects` with a unique lowercase hyphenated `id`, a title and category, and an accurate description. Use `illustrative: true` for design concepts. Add approved project images under `docs/assets/images/` and describe them with the same image fields as the portrait. Keep unapproved text and media outside the repository. A `draft` flag only hides an approved entry from the rendered page. Anyone can read files served from `docs/` directly.

```js
{
  id: 'approved-project',
  title: 'YOUR_PROJECT_TITLE',
  category: 'Industrial automation',
  description: 'YOUR_PROJECT_DESCRIPTION',
  status: 'YOUR_PROJECT_STATUS',
  features: [],
  technologies: [],
  image: { path: 'assets/images/project.webp', alt: 'YOUR_IMAGE_DESCRIPTION', width: 960, height: 540 },
  caseStudy: { problem: 'YOUR_PROBLEM', role: 'YOUR_CONTRIBUTION', architecture: 'YOUR_ARCHITECTURE', testing: 'YOUR_VALIDATION' },
  gallery: [],
  githubUrl: '',
  demoUrl: ''
}
```

Use other case-study fields as needed, such as `constraints`, `hardware`, `firmware`, `connectivity`, `dataFlow`, `platform`, `decisions`, `results`, and `lessons`. Give each case study evidence specific to the project and clear disclosure limits. To hide a whole unused section, add `hidden` to its section element in `docs/index.html` and remove any navigation link that targets it.

## Résumé and contact

Copy the real PDF under `docs/assets/files/` and set `resume.path` to its relative filename. Set `resume.preview` to `false` if only a download should appear.

Set `contact.email` to a public email address. With `mode: 'email'` the form prepares a draft and the visitor sends it from their email app. For an approved provider, set `mode: 'provider'`, `endpoint`, and `providerName`. The endpoint must support a cross-origin form POST from the site and confirm success with a JSON response containing `ok: true`. Configure spam protection with the provider. Keep private credentials out of the repository.

## Theme, metadata, and release

- Change semantic color and font variables in `docs/assets/css/base.css`. If replacing the local font, include the license under `docs/assets/fonts/`.
- Update the HTML title, description, canonical, Open Graph and Twitter metadata in `docs/index.html`. Replace `docs/assets/images/social-preview.png` when branding changes.
- Update the destination in `docs/sitemap.xml`, `docs/robots.txt`, and both the fallback homepage URL and project base in `docs/404.html`. If the site is hosted below a Pages subdirectory, host-level crawler directives come from the host's root robots file.
- Set `seo.person` to `true` after the public identity is approved and remove the preview `noindex` when the site is ready for discovery.
- Follow [the release instructions](README.md) and verify the published URL after authorization.

## Personal information checklist

- [ ] Name, designation, tagline, introduction, and biography
- [ ] Public location and optional portrait
- [ ] Verified skills, experience, education, credentials, and achievements
- [ ] Approved project details, links, images, and validation evidence
- [ ] Confirmed services
- [ ] Public résumé PDF, email, and public social profiles
- [ ] Final domain, canonical URL, sharing graphic, and indexing decision
