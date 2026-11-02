/*
 * Smoke test: boots the server, requests every route, and checks every internal
 * link found in the HTML resolves. Usage: npm test
 */
const http = require('http');
const server = require('../server');
const { ROUTES } = require('../src/routes');

const get = (port, p, method = 'GET', body) => new Promise((resolve, reject) => {
  const req = http.request({ port, path: p, method, headers: body ? { 'Content-Type': 'application/json' } : {} }, (res) => {
    let d = ''; res.on('data', (c) => { d += c; }); res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
  });
  req.on('error', reject);
  if (body) req.write(JSON.stringify(body));
  req.end();
});

server.listen(0, async () => {
  const { port } = server.address();
  const failures = [];
  const links = new Set();
  for (const route of Object.keys(ROUTES)) {
    const r = await get(port, route);
    if (r.status !== 200) failures.push(`${route} → ${r.status}`);
    if (!/<h1[\s>]/.test(r.body)) failures.push(`${route} has no <h1>`);
    for (const m of r.body.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1]);
  }
  for (const l of links) {
    const r = await get(port, l);
    if (![200, 302].includes(r.status)) failures.push(`broken link ${l} → ${r.status}`);
  }
  const extra = [['/sitemap.xml', 200], ['/robots.txt', 200], ['/nope', 404], ['/go/chatgpt', 302]];
  for (const [p, s] of extra) { const r = await get(port, p); if (r.status !== s) failures.push(`${p} → ${r.status} (want ${s})`); }
  const sub = await get(port, '/api/subscribe', 'POST', { email: 'bad' });
  if (sub.status !== 422) failures.push('subscribe validation failed');

  console.log(`Checked ${Object.keys(ROUTES).length} pages and ${links.size} internal links.`);
  if (failures.length) { console.error('FAILURES:\n' + failures.join('\n')); process.exitCode = 1; } else console.log('All good ✔');
  server.close();
});
