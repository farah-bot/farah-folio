import { supabase } from '../lib/supabase';

export const prerender = false;

const SITE = 'https://farah-folio.vercel.app';

export async function GET() {
  const { data: projects } = await supabase
    .from('projects')
    .select('id');

  const staticRoutes = [
    `${SITE}/`,
    `${SITE}/projects`,
    `${SITE}/about`,
  ];

  const projectRoutes = (projects ?? []).map(
    project => `${SITE}/projects/${project.id}`
  );

  const routes = [
    ...staticRoutes,
    ...projectRoutes,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(url => `  <url>
    <loc>${url}</loc>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
