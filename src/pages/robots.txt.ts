import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/urls';

export const GET: APIRoute = ({ site }) => new Response(
  'User-agent: *\nAllow: /\nSitemap: ' + absoluteUrl(site, 'sitemap.xml') + '\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
