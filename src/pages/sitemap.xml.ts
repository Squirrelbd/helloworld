import type { APIRoute } from 'astro';
import { publishedProjects } from '../lib/projects';
import { absoluteUrl } from '../lib/urls';

export const GET: APIRoute = async ({ site }) => {
  const projects = await publishedProjects();
  const urls = [absoluteUrl(site), ...projects.map(({ data }) => absoluteUrl(site, 'projects/' + data.slug + '/'))];
  const entries = urls.map((url) => '<url><loc>' + url + '</loc></url>').join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries + '</urlset>', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
