export const prerender = true;

export async function GET() {
  const SITE = 'https://farahfairuz.dev';
  const now  = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: `${SITE}/`,         priority: '1.0', changefreq: 'weekly'  },
    { url: `${SITE}/projects`, priority: '0.9', changefreq: 'weekly'  },
    { url: `${SITE}/about`,    priority: '0.8', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(r => `  <url>
    <loc>${r.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600',
    },
  });
}
