/*
 * Static export: renders every page to /dist so the site can also be hosted
 * on plain shared hosting (upload dist/ to public_html) or any static host.
 * Usage: npm run build
 */
const fs = require('fs');
const path = require('path');
const { ROUTES, sitemap, robots } = require('../src/routes');
const P = require('../src/views/pages');
const C = require('../src/lib/content');

const OUT = path.join(__dirname, '..', 'dist');
fs.rmSync(OUT, { recursive: true, force: true });

const write = (rel, content) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

let n = 0;
for (const [route, fn] of Object.entries(ROUTES)) {
  write(route === '/' ? 'index.html' : path.join(route, 'index.html'), fn());
  n++;
}
C.tools.forEach((t) => write(path.join('go', t.slug, 'index.html'), P.goPage(t)));
write('404.html', P.notFound());
write('sitemap.xml', sitemap());
write('robots.txt', robots());

// Apache (Hostinger shared hosting): clean URLs, 404 page, caching, gzip.
write('.htaccess', `ErrorDocument 404 /404.html
Options -Indexes
DirectoryIndex index.html
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/svg+xml "access plus 30 days"
</IfModule>
`);

// Copy public assets
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name); const d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
};
copyDir(path.join(__dirname, '..', 'public'), OUT);

console.log(`Built ${n} pages + ${C.tools.length} redirects → dist/`);
console.log('Note: newsletter/contact forms need the Node server (npm start) or a form service when hosted statically.');
