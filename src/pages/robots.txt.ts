export const prerender = true;

export function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://farah-folio.vercel.app/sitemap.xml
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
