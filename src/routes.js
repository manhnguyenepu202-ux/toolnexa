// Single source of truth for every page. Used by server.js and the static build.
const site = require('./config');
const C = require('./lib/content');
const P = require('./views/pages');

// Map of exact path → render function
function staticRoutes() {
  const r = {
    '/': P.home,
    '/tools': P.directory,
    '/compare': P.compareIndex,
    '/best': P.bestIndex,
    '/blog': P.blogIndex,
    '/about': P.about,
    '/affiliate-disclosure': P.disclosure,
    '/privacy': P.privacy,
    '/terms': P.terms,
    '/contact': P.contact
  };
  C.categories.forEach((c) => { r[`/category/${c.slug}`] = () => P.category(c); });
  C.tools.forEach((t) => { r[`/tools/${t.slug}`] = () => P.tool(t); });
  C.comparisons.forEach((c) => { r[`/compare/${c.slug}`] = () => P.compare(c); });
  C.bestof.forEach((b) => { r[`/best/${b.slug}`] = () => P.best(b); });
  C.posts.forEach((p) => { r[`/blog/${p.slug}`] = () => P.post(p); });
  return r;
}

const ROUTES = staticRoutes();

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.keys(ROUTES).map((p) => {
    const post = p.startsWith('/blog/') && C.postMap[p.slice(6)];
    const prio = p === '/' ? '1.0' : /^\/(tools|compare|best|category)\/[^/]+$/.test(p) ? '0.8' : '0.6';
    return `<url><loc>${site.url}${p === '/' ? '/' : p}</loc><lastmod>${post ? post.date : today}</lastmod><priority>${prio}</priority></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

const robots = () => `User-agent: *\nAllow: /\nDisallow: /go/\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`;

module.exports = { ROUTES, sitemap, robots };
