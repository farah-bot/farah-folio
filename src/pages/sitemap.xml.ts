import { supabase } from '../lib/supabase';

export const prerender = false;

const SITE = 'https://farah-folio.vercel.app';

type ProjectItem = {
  id: string;
  is_visible?: boolean;
};

export async function GET() {
  let projects: ProjectItem[] = [];

  const { data, error } = await supabase
    .from('projects')
    .select('id, is_visible')
    .eq('is_visible', true);

  if (error && error.code === '42703') {
    const fallback = await supabase
      .from('projects')
      .select('id');
    projects = (fallback.data as ProjectItem[]) ?? [];
  } else {
    projects = (data as ProjectItem[]) ?? [];
  }

  const visibleProjects = projects.filter(p => p.is_visible !== false);

  const staticRoutes = [
    `${SITE}/`,
    `${SITE}/projects`,
    `${SITE}/about`,
  ];

  const projectRoutes = visibleProjects.map(
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
