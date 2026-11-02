/*
 * ToolKenzon.com — zero-dependency Node.js server (Node 18+).
 * Start: npm start   (PORT env var is respected; Hostinger sets it automatically)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { URL } = require('url');

const { ROUTES, sitemap, robots } = require('./src/routes');
const P = require('./src/views/pages');
const C = require('./src/lib/content');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'storage');
const isProd = process.env.NODE_ENV === 'production';

const MIME = {
  '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.woff2': 'font/woff2'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Render-once cache for HTML pages (content is static between deploys).
const cache = new Map();
const render = (key, fn) => {
  if (isProd && cache.has(key)) return cache.get(key);
  const out = fn();
  if (isProd) cache.set(key, out);
  return out;
};

function send(req, res, status, body, type, extra = {}) {
  const headers = { 'Content-Type': type, ...SECURITY_HEADERS, ...extra };
  const accept = req.headers['accept-encoding'] || '';
  let buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  if (buf.length > 1024 && /\bgzip\b/.test(accept) && /text|javascript|json|xml|svg/.test(type)) {
    buf = zlib.gzipSync(buf);
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  }
  headers['Content-Length'] = buf.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : buf);
}

function serveStatic(req, res, pathname) {
  const file = path.normalize(path.join(PUBLIC, pathname));
  if (!file.startsWith(PUBLIC)) return false;
  let stat;
  try { stat = fs.statSync(file); } catch { return false; }
  if (!stat.isFile()) return false;
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  send(req, res, 200, fs.readFileSync(file), type, {
    'Cache-Control': isProd ? 'public, max-age=604800' : 'no-cache'
  });
  return true;
}

function readBody(req, limit = 20000) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > limit) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => {
      const ct = req.headers['content-type'] || '';
      try {
        if (ct.includes('application/json')) return resolve(JSON.parse(data || '{}'));
        return resolve(Object.fromEntries(new URLSearchParams(data)));
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function store(file, record) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(path.join(DATA_DIR, file), JSON.stringify({ ...record, at: new Date().toISOString() }) + '\n');
}

async function handleApi(req, res, pathname) {
  const json = (status, obj) => send(req, res, status, JSON.stringify(obj), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store' });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });
  let body;
  try { body = await readBody(req); } catch { return json(400, { ok: false, error: 'Invalid request' }); }
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json(422, { ok: false, error: 'Please enter a valid email address.' });

  if (pathname === '/api/subscribe') {
    // TODO: forward to your email platform (Brevo / MailerLite / Kit API) here.
    store('subscribers.jsonl', { email });
    return json(200, { ok: true, message: 'You\'re in! Check your inbox to confirm.' });
  }
  if (pathname === '/api/contact') {
    const message = String(body.message || '').trim();
    const name = String(body.name || '').trim();
    if (!name || !message) return json(422, { ok: false, error: 'Please fill in your name and message.' });
    store('messages.jsonl', { name: name.slice(0, 200), email, topic: String(body.topic || '').slice(0, 100), message: message.slice(0, 5000) });
    return json(200, { ok: true, message: 'Thanks! We\'ll get back to you within two business days.' });
  }
  return json(404, { ok: false, error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);

    // Normalise trailing slash (except root) → 301 for clean canonical URLs
    if (pathname.length > 1 && pathname.endsWith('/')) {
      res.writeHead(301, { Location: pathname.replace(/\/+$/, '') + url.search });
      return res.end();
    }

    if (pathname.startsWith('/api/')) return handleApi(req, res, pathname);

    if (pathname.startsWith('/go/')) {
      const t = C.toolMap[pathname.slice(4)];
      if (t) {
        res.writeHead(302, { Location: t.affiliateUrl || t.website, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
        return res.end();
      }
    }

    if (pathname === '/sitemap.xml') return send(req, res, 200, render('sitemap', sitemap), MIME['.xml']);
    if (pathname === '/robots.txt') return send(req, res, 200, robots(), MIME['.txt']);
    if (pathname === '/healthz') return send(req, res, 200, 'ok', MIME['.txt']);

    const route = ROUTES[pathname];
    if (route && (req.method === 'GET' || req.method === 'HEAD')) {
      return send(req, res, 200, render(pathname, route), 'text/html; charset=utf-8', { 'Cache-Control': 'public, max-age=300' });
    }

    if (serveStatic(req, res, pathname)) return;

    return send(req, res, 404, render('404', P.notFound), 'text/html; charset=utf-8');
  } catch (err) {
    console.error(err);
    return send(req, res, 500, 'Internal server error', 'text/plain; charset=utf-8');
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`ToolKenzon running on http://localhost:${PORT}`));
}

module.exports = server;
