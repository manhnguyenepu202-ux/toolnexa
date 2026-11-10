const { html, raw, formatDate } = require('../lib/util');
const { icon } = require('../lib/icons');
const { catMap, subMap, toolMap } = require('../lib/content');

const initials = (name) => name.replace(/\(.*\)/, '').replace(/\.com$/, '').split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function logoTile(t, size = 'md') {
  if (t.logo) return html`<span class="tlogo tlogo-${size} tlogo-img" aria-hidden="true"><img src="/img/logos/${t.slug}.png" alt="" width="88" height="88" loading="lazy" decoding="async"></span>`;
  return html`<span class="tlogo tlogo-${size}" style="--brand:${t.color};--brand-fg:${t.textColor || '#fff'}" aria-hidden="true">${initials(t.name)}</span>`;
}

function scorePill(score, label = 'ToolKenzon score') {
  return html`<span class="score-pill" title="${label}: ${score.toFixed(1)} out of 10">${icon('star', 'star', 14)}<b>${score.toFixed(1)}</b><span class="sr-only"> out of 10</span></span>`;
}

function pricingTag(t) {
  const cls = { Free: 'tag-green', Freemium: 'tag-blue', 'Free Trial': 'tag-amber', Paid: 'tag-slate' }[t.pricingModel] || 'tag-slate';
  return html`<span class="tag ${cls}">${t.pricingModel}</span>`;
}

function visitBtn(t, cls = 'btn btn-accent', label = 'Visit site') {
  return html`<a class="${cls}" href="/go/${t.slug}" target="_blank" rel="sponsored nofollow noopener" data-track="visit" data-tool="${t.slug}">${label} ${icon('external', '', 16)}<span class="sr-only"> (opens ${t.name} in a new tab)</span></a>`;
}

function toolCard(t) {
  const sub = subMap[t.sub];
  return html`<article class="tool-card" data-cat="${t.category}" data-sub="${t.sub}" data-pricing="${t.pricingModel}" data-free="${t.freePlan ? '1' : '0'}" data-score="${t.score}" data-price="${t.priceValue}" data-name="${t.name.toLowerCase()}" data-search="${(t.name + ' ' + t.tagline + ' ' + sub.name + ' ' + t.features.join(' ')).toLowerCase()}">
    <div class="tc-head">
      ${logoTile(t)}
      <div class="tc-title">
        <h3><a href="/tools/${t.slug}" class="stretched">${t.name}</a></h3>
        <span class="tc-sub">${sub.name}</span>
      </div>
      ${t.editorsPick ? html`<span class="badge-pick" title="Editor's pick">${icon('trophy', '', 14)} Pick</span>` : ''}
    </div>
    <p class="tc-desc">${t.tagline}</p>
    <div class="tc-meta">
      ${scorePill(t.score)}
      ${pricingTag(t)}
      <span class="tc-price">From ${t.startingPrice.replace(/\s*\(.*\)/, '')}</span>
    </div>
    <div class="tc-actions">
      <a class="btn btn-ghost btn-sm" href="/tools/${t.slug}">Read review</a>
      ${visitBtn(t, 'btn btn-outline btn-sm', 'Visit')}
    </div>
  </article>`;
}

function compareCard(c) {
  return html`<a class="compare-card" href="/compare/${c.slug}">
    <div class="cc-logos">${logoTile(c.toolA)}<span class="vs">VS</span>${logoTile(c.toolB)}</div>
    <h3>${c.toolA.name} vs ${c.toolB.name}</h3>
    <p>${c.summary}</p>
    <span class="link-arrow">See comparison ${icon('arrowRight', '', 16)}</span>
  </a>`;
}

function bestCard(b) {
  const cat = catMap[b.category];
  return html`<a class="best-card" href="/best/${b.slug}" style="--cat:${cat.color}">
    <span class="best-ic">${icon('trophy', '', 22)}</span>
    <div>
      <span class="eyebrow">${cat.name}</span>
      <h3>${b.title}</h3>
      <div class="best-logos">${b.picks.slice(0, 4).map(([s]) => logoTile(toolMap[s], 'sm'))}<span class="small muted">${b.picks.length} picks</span></div>
    </div>
  </a>`;
}

function postCard(p) {
  const cat = catMap[p.category];
  return html`<article class="post-card">
    <a href="/blog/${p.slug}" class="post-cover" style="--cat:${p.coverColor || (cat ? cat.color : '#2563EB')}" tabindex="-1" aria-hidden="true">${icon(p.cover, '', 40)}</a>
    <div class="post-body">
      <span class="eyebrow">${cat ? cat.name : 'Guide'}</span>
      <h3><a href="/blog/${p.slug}">${p.title}</a></h3>
      <p>${p.description}</p>
      <p class="post-meta">${icon('clock', '', 14)} ${p.readTime} min read · <time datetime="${p.date}">${formatDate(p.date)}</time></p>
    </div>
  </article>`;
}

function breadcrumbs(items) {
  return html`<nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="/">Home</a></li>
    ${items.map((it, i) => (i === items.length - 1
    ? html`<li aria-current="page">${it.label}</li>`
    : html`<li><a href="${it.href}">${it.label}</a></li>`))}
  </ol></nav>`;
}

const breadcrumbLd = (site, items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', href: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.label || it.name, item: site.url + (it.href || '/')
  }))
});

function scoreBars(t) {
  const rows = [['Ease of use', t.scores.ease], ['Features', t.scores.features], ['Value for money', t.scores.value], ['Support', t.scores.support]];
  return html`<dl class="score-bars">${rows.map(([k, v]) => html`<div class="sb-row"><dt>${k}</dt><dd><span class="sb-track"><span class="sb-fill" style="width:${v * 10}%"></span></span><b>${v.toFixed(1)}</b></dd></div>`)}</dl>`;
}

function scoreRing(score, size = 92) {
  const r = 40; const c = 2 * Math.PI * r; const off = c * (1 - score / 10);
  return html`<div class="score-ring" style="width:${size}px;height:${size}px" role="img" aria-label="ToolKenzon score ${score.toFixed(1)} out of 10">
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${r}" class="sr-bg"/><circle cx="50" cy="50" r="${r}" class="sr-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
    <span><b>${score.toFixed(1)}</b><small>/10</small></span>
  </div>`;
}

function newsletter(variant = '') {
  return html`<section class="newsletter ${variant}" aria-labelledby="nl-h">
    <div class="container nl-inner">
      <div>
        <h2 id="nl-h">Get the best new tools in your inbox</h2>
        <p>One short email every two weeks: new reviews, price drops and deals worth knowing. No spam, unsubscribe anytime.</p>
      </div>
      <form class="nl-form" action="/api/subscribe" method="post" data-ajax novalidate>
        <label for="nl-email-${variant || 'x'}" class="sr-only">Email address</label>
        <input id="nl-email-${variant || 'x'}" type="email" name="email" placeholder="you@company.com" required autocomplete="email">
        <button class="btn btn-accent" type="submit">Subscribe</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>`;
}

function disclosureNote() {
  return html`<p class="disclosure">${icon('info', '', 16)} <span>We review tools independently. Some links are affiliate links — if you buy, we may earn a commission at no extra cost to you. <a href="/affiliate-disclosure">How we make money</a>.</span></p>`;
}

module.exports = { logoTile, scorePill, pricingTag, visitBtn, toolCard, compareCard, bestCard, postCard, breadcrumbs, breadcrumbLd, scoreBars, scoreRing, newsletter, disclosureNote, initials, raw };
