export function withBase(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}

export function projectHref(slug: string) {
  return withBase('projects/' + slug + '/');
}

export function absoluteUrl(site: URL | undefined, path = '') {
  if (!site) throw new Error('Astro site URL is required for absolute URLs.');
  return new URL(withBase(path), site).href;
}
