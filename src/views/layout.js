const site = require('../config');
const { html, raw, esc } = require('../lib/util');
const { icon } = require('../lib/icons');
const { categories, bestof, comparisons } = require('../lib/content');

const NAV = [
  { href: '/tools', label: 'Directory' },
  { href: '/category/ai-tools', label: 'AI Tools' },
  { href: '/category/saas', label: 'SaaS' },
  { href: '/category/email-marketing', label: 'Email Marketing' },
  { href: '/compare', label: 'Compare' },
  { href: '/blog', label: 'Guides' }
];

function logo() {
  return html`<a href="/" class="logo" aria-label="ToolKenzon home">
    <span class="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#lg)"/><path d="M9 10h14M16 10v13" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="3" fill="#FDBA74"/></svg>
    </span>
    <span class="logo-text">Tool<span>Kenzon</span></span>
  </a>`;
}

function header(current) {
  return html`<header class="site-header" id="top">
  <div class="container header-inner">
    ${logo()}
    <nav class="main-nav" aria-label="Main">
      <ul>${NAV.map((n) => html`<li><a href="${n.href}"${current && current.startsWith(n.href) ? raw(' aria-current="page"') : ''}>${n.label}</a></li>`)}</ul>
    </nav>
    <div class="header-actions">
      <form class="header-search" action="/tools" method="get" role="search">
        <label for="hs" class="sr-only">Search tools</label>
        ${icon('search', 'hs-icon', 18)}
        <input id="hs" name="q" type="search" placeholder="Search tools…" autocomplete="off">
      </form>
      <button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}</button>
      <a class="btn btn-accent btn-sm hide-sm" href="/best/email-marketing-software">Top Picks</a>
      <button class="icon-btn nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
    </div>
  </div>
  <div class="mobile-nav" id="mobile-nav" hidden>
    <form action="/tools" method="get" role="search" class="mobile-search">
      <label for="ms" class="sr-only">Search tools</label>
      <input id="ms" name="q" type="search" placeholder="Search 30+ tools…">
      <button class="btn btn-primary" type="submit">Search</button>
    </form>
    <ul>${NAV.map((n) => html`<li><a href="${n.href}">${n.label}</a></li>`)}<li><a href="/best">Best Of Lists</a></li></ul>
  </div>
</header>`;
}

function footer() {
  return html`<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        ${logo()}
        <p>${site.description}</p>
        <p class="small muted">ToolKenzon is reader-supported. We may earn a commission when you buy through links on our site, at no extra cost to you. <a href="/affiliate-disclosure">Learn more</a>.</p>
      </div>
      ${categories.map((c) => html`<div>
        <h3 class="footer-h">${c.name}</h3>
        <ul>${c.subcategories.map((s) => html`<li><a href="/category/${c.slug}?sub=${s.slug}">${s.name}</a></li>`)}</ul>
      </div>`)}
      <div>
        <h3 class="footer-h">Best Of</h3>
        <ul>${bestof.map((b) => html`<li><a href="/best/${b.slug}">${b.title.replace('Best ', '')}</a></li>`)}</ul>
      </div>
      <div>
        <h3 class="footer-h">Popular Comparisons</h3>
        <ul>${comparisons.slice(0, 6).map((c) => html`<li><a href="/compare/${c.slug}">${c.toolA.name} vs ${c.toolB.name}</a></li>`)}</ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${site.year} ToolKenzon.com. All rights reserved.</p>
      <ul class="footer-legal">
        <li><a href="/about">About & Methodology</a></li>
        <li><a href="/affiliate-disclosure">Affiliate Disclosure</a></li>
        <li><a href="/privacy">Privacy</a></li>
        <li><a href="/terms">Terms</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

/**
 * page({ title, description, path, body, jsonLd, ogType })
 */
function page({ title, description, path = '/', body, jsonLd = [], ogType = 'website', noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description || site.description;
  const canonical = site.url + (path === '/' ? '/' : path.replace(/\/$/, ''));
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, logo: site.url + '/img/logo.svg' },
    ...jsonLd
  ];
  return '<!DOCTYPE html>' + html`
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="impact-site-verification" value="9166c2b2-73fd-4324-939d-df23baf80a1e">
<meta name="impact-site-verification" value="741f188b-c309-43df-a436-7da8e7b3ab34">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${noindex ? raw('<meta name="robots" content="noindex">') : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2563EB">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/css/style.css?v=7">
<script>try{var t=localStorage.getItem('tn-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
${raw(ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n'))}
${site.gaId ? raw(`<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(site.gaId)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(site.gaId)}');</script>`) : ''}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${raw(String(body))}
</main>
${footer()}
<script src="/js/app.js?v=1" defer></script>
</body>
</html>`;
}

module.exports = { page };
