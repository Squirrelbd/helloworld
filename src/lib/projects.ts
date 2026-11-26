import { getCollection } from 'astro:content';

export async function publishedProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  const slugs = new Set<string>();
  for (const { data } of projects) {
    if (slugs.has(data.slug)) throw new Error('Duplicate project slug: ' + data.slug);
    slugs.add(data.slug);
  }
  return projects.sort((a, b) =>
    Number(b.data.featured) - Number(a.data.featured)
    || a.data.order - b.data.order
    || a.data.slug.localeCompare(b.data.slug)
  );
}
