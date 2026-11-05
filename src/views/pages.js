const site = require('../config');
const { html, raw, formatDate } = require('../lib/util');
const { icon } = require('../lib/icons');
const C = require('../lib/content');
const {
  logoTile, scorePill, pricingTag, visitBtn, toolCard, compareCard, bestCard, postCard,
  breadcrumbs, breadcrumbLd, scoreBars, scoreRing, newsletter
} = require('./components');
const { page } = require('./layout');

const sectionHead = (eyebrow, title, link, linkLabel) => html`<div class="section-head">
  <div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>
  ${link ? html`<a class="link-arrow" href="${link}">${linkLabel} ${icon('arrowRight', '', 16)}</a>` : ''}
</div>`;

const latestPricingCheck = C.tools.map((t) => t.pricingChecked).filter(Boolean).sort().pop();

const evidenceNotes = {
  research: 'Based on vendor pricing pages, documentation and public user reviews.',
  'hands-on': 'Includes our own hands-on notes alongside vendor documentation and public user reviews.'
};

function articleBlock(a, heading) {
  if (!a) return '';
  return html`<section class="article-block" aria-labelledby="full-article">
    <h2 id="full-article">${heading}</h2>
    <p class="small muted">Updated <time datetime="${a.updated}">${formatDate(a.updated)}</time> · ${a.readTime} min read · ${evidenceNotes[a.evidence]}</p>
    ${a.toc.length > 2 ? html`<nav class="article-toc" aria-label="In this article"><p class="f-label">In this article</p><ol>${a.toc.map((h) => html`<li><a href="#${h.id}">${h.text.replace(/\*\*/g, '')}</a></li>`)}</ol></nav>` : ''}
    <div class="prose">${raw(a.html)}</div>
  </section>`;
}

// ───────────────────────────── HOME ─────────────────────────────
function home() {
  const trending = C.tools.filter((t) => t.trending || t.editorsPick).sort((a, b) => b.score - a.score).slice(0, 9);
  const body = html`
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="container hero-inner">
    <span class="hero-badge">${icon('shield', '', 16)} Independent reviews · Updated ${formatDate(latestPricingCheck + '-01').replace(/\s\d+,/, '')}</span>
    <h1>Find the right <span class="grad">AI, SaaS & email</span> tools — without the guesswork.</h1>
    <p class="lead">Research-based reviews, honest scores and side-by-side comparisons of ${C.tools.length}+ tools, so you can pick the right one in minutes, not weeks.</p>
    <form class="hero-search" action="/tools" method="get" role="search">
      <label for="hero-q" class="sr-only">Search tools</label>
      ${icon('search', 'hs-icon', 22)}
      <input id="hero-q" name="q" type="search" placeholder="Try “email automation”, “AI writer” or “Notion”" autocomplete="off">
      <button class="btn btn-primary" type="submit">Search</button>
    </form>
    <div class="hero-chips" aria-label="Popular searches">
      <span class="muted small">Popular:</span>
      <a class="chip" href="/compare/chatgpt-vs-claude">ChatGPT vs Claude</a>
      <a class="chip" href="/best/email-marketing-software">Best email software</a>
      <a class="chip" href="/best/ai-writing-tools">AI writers</a>
      <a class="chip" href="/compare/zapier-vs-make">Zapier vs Make</a>
    </div>
    <ul class="hero-stats">
      <li><b>${C.tools.length}+</b><span>tools reviewed</span></li>
      <li><b>${C.comparisons.length}</b><span>head-to-heads</span></li>
      <li><b>${C.bestof.length}</b><span>buying guides</span></li>
      <li><b>100%</b><span>editorially independent</span></li>
    </ul>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cat-grid">
      ${C.categories.map((c) => html`<a class="cat-card" href="/category/${c.slug}" style="--cat:${c.color}">
        <span class="cat-ic">${icon(c.icon, '', 26)}</span>
        <h2>${c.name}</h2>
        <p>${c.description}</p>
        <span class="cat-count">${C.toolsIn(c.slug).length} tools reviewed ${icon('arrowRight', '', 16)}</span>
      </a>`)}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead('Trending now', 'Top-rated tools this month', '/tools', 'Browse all tools')}
    <div class="tabs" role="tablist" aria-label="Filter trending tools">
      <button role="tab" aria-selected="true" data-tab="all">All</button>
      ${C.categories.map((c) => html`<button role="tab" aria-selected="false" data-tab="${c.slug}">${c.short}</button>`)}
    </div>
    <div class="tool-grid" data-tabgrid>
      ${C.tools.slice().sort((a, b) => b.score - a.score).map((t, i) => {
    const show = trending.includes(t);
    return html`<div class="tab-item" data-cat="${t.category}" data-trending="${show ? '1' : '0'}"${show ? '' : raw(' hidden')}>${toolCard(t)}</div>`;
  })}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Head to head', 'Popular comparisons', '/compare', 'All comparisons')}
    <div class="compare-grid">${C.comparisons.slice(0, 6).map(compareCard)}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead('Buying guides', 'Best-of lists, ranked by our editors', '/best', 'All guides')}
    <div class="best-grid">${C.bestof.map(bestCard)}</div>
  </div>
</section>

<section class="section">
  <div class="container how">
    <div>
      <span class="eyebrow">How we review</span>
      <h2>Scores you can actually trust</h2>
      <p class="lead-sm">Every tool is scored by our editors on the same four criteria. Vendors can't pay for a higher score or a better ranking.</p>
      <a class="btn btn-ghost" href="/about">Read our methodology</a>
    </div>
    <ol class="how-steps">
      <li><span>${icon('users', '', 22)}</span><div><h3>Research first</h3><p>We read pricing pages, documentation and public user reviews before we score a tool.</p></div></li>
      <li><span>${icon('scale', '', 22)}</span><div><h3>Same criteria for all</h3><p>Ease of use, features, value for money and support — weighted the same across a category.</p></div></li>
      <li><span>${icon('tag', '', 22)}</span><div><h3>Real pricing</h3><p>We show the price you'll actually pay and flag where costs climb as you grow.</p></div></li>
      <li><span>${icon('clock', '', 22)}</span><div><h3>Dated pricing</h3><p>Pages show when pricing was last checked. Vendors change prices often, so confirm before you buy.</p></div></li>
    </ol>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead('Guides', 'Latest from the blog', '/blog', 'All guides')}
    <div class="post-grid">${C.posts.slice(0, 3).map(postCard)}</div>
  </div>
</section>

${newsletter('home')}
`;
  return page({
    path: '/', body,
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, potentialAction: { '@type': 'SearchAction', target: site.url + '/tools?q={search_term_string}', 'query-input': 'required name=search_term_string' } }]
  });
}

// ───────────────────────────── DIRECTORY ─────────────────────────────
function directory() {
  const sorted = C.tools.slice().sort((a, b) => b.score - a.score);
  const body = html`
<section class="page-hero">
  <div class="container">
    ${breadcrumbs([{ label: 'Tool Directory', href: '/tools' }])}
    <h1>Tool Directory</h1>
    <p class="lead">Browse and filter ${C.tools.length} AI, SaaS and email marketing tools we've reviewed.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container dir-layout">
    <aside class="filters" aria-label="Filters">
      <div class="filter-group">
        <label for="f-q" class="f-label">Search</label>
        <div class="input-icon">${icon('search', '', 18)}<input id="f-q" type="search" placeholder="Name, feature, use case…" autocomplete="off"></div>
      </div>
      <fieldset class="filter-group">
        <legend class="f-label">Category</legend>
        <label class="radio"><input type="radio" name="f-cat" value="" checked> All categories</label>
        ${C.categories.map((c) => html`<label class="radio"><input type="radio" name="f-cat" value="${c.slug}"> ${c.name}</label>`)}
      </fieldset>
      <div class="filter-group">
        <label for="f-sub" class="f-label">Sub-category</label>
        <select id="f-sub"><option value="">All sub-categories</option>
          ${C.categories.map((c) => html`<optgroup label="${c.name}">${c.subcategories.map((s) => html`<option value="${s.slug}" data-parent="${c.slug}">${s.name}</option>`)}</optgroup>`)}
        </select>
      </div>
      <fieldset class="filter-group">
        <legend class="f-label">Pricing</legend>
        <label class="check"><input type="checkbox" id="f-free"> Has a free plan</label>
        <label for="f-pricing" class="sr-only">Pricing model</label>
        <select id="f-pricing"><option value="">Any pricing model</option><option>Freemium</option><option>Free Trial</option><option>Paid</option></select>
      </fieldset>
      <button class="btn btn-ghost btn-sm" type="button" id="f-reset">Reset filters</button>
    </aside>
    <div>
      <div class="dir-bar">
        <p id="dir-count" class="muted" role="status" aria-live="polite">Showing ${C.tools.length} tools</p>
        <label class="sort"><span>Sort by</span>
          <select id="f-sort"><option value="score">Highest score</option><option value="name">Name A–Z</option><option value="price">Lowest starting price</option></select>
        </label>
      </div>
      <div class="tool-grid tool-grid-2" id="dir-grid">${sorted.map(toolCard)}</div>
      <div class="empty" id="dir-empty" hidden>
        <h2>No tools match those filters</h2>
        <p>Try removing a filter or searching for a broader term.</p>
      </div>
    </div>
  </div>
</section>
${newsletter('dir')}`;
  return page({ title: 'AI, SaaS & Email Marketing Tool Directory', description: `Filter and compare ${C.tools.length}+ AI tools, SaaS platforms and email marketing software by category, pricing and score.`, path: '/tools', body, jsonLd: [breadcrumbLd(site, [{ label: 'Tool Directory', href: '/tools' }])] });
}

// ───────────────────────────── CATEGORY ─────────────────────────────
function category(cat) {
  const list = C.toolsIn(cat.slug);
  const comps = C.comparisons.filter((c) => c.toolA.category === cat.slug || c.toolB.category === cat.slug);
  const bests = C.bestof.filter((b) => b.category === cat.slug);
  const posts = C.posts.filter((p) => p.category === cat.slug);
  const crumbs = [{ label: cat.name, href: `/category/${cat.slug}` }];
  const body = html`
<section class="page-hero" style="--cat:${cat.color}">
  <div class="container">
    ${breadcrumbs(crumbs)}
    <div class="cat-hero">
      <span class="cat-ic lg">${icon(cat.icon, '', 30)}</span>
      <div><h1>Best ${cat.name} in ${site.year}</h1><p class="lead">${cat.description}</p></div>
    </div>
    <div class="chip-row" data-subfilter>
      <button class="chip" aria-pressed="true" data-sub="">All (${list.length})</button>
      ${cat.subcategories.filter((s) => list.some((t) => t.sub === s.slug)).map((s) => html`<button class="chip" aria-pressed="false" data-sub="${s.slug}">${s.name} (${list.filter((t) => t.sub === s.slug).length})</button>`)}
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="container">
    <div class="tool-grid" data-subgrid>${list.map(toolCard)}</div>
  </div>
</section>
${bests.length ? html`<section class="section section-alt"><div class="container">${sectionHead('Buying guides', `${cat.name} roundups`)}<div class="best-grid">${bests.map(bestCard)}</div></div></section>` : ''}
${comps.length ? html`<section class="section"><div class="container">${sectionHead('Head to head', `${cat.name} comparisons`, '/compare', 'All comparisons')}<div class="compare-grid">${comps.map(compareCard)}</div></div></section>` : ''}
${posts.length ? html`<section class="section section-alt"><div class="container">${sectionHead('Guides', `${cat.name} guides`, '/blog', 'All guides')}<div class="post-grid">${posts.map(postCard)}</div></div></section>` : ''}
${newsletter('cat')}`;
  return page({
    title: `Best ${cat.name} (${site.year}) — Reviews & Comparisons`,
    description: `Compare the best ${cat.name.toLowerCase()} of ${site.year}. ${cat.description}`,
    path: `/category/${cat.slug}`, body,
    jsonLd: [breadcrumbLd(site, crumbs), { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best ${cat.name}`, itemListElement: list.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/tools/${t.slug}`, name: t.name })) }]
  });
}

// ───────────────────────────── TOOL REVIEW ─────────────────────────────
function tool(t) {
  const cat = C.catMap[t.category];
  const sub = C.subMap[t.sub];
  const alts = t.alternatives.map((s) => C.toolMap[s]);
  const comps = C.comparisonsFor(t.slug);
  const crumbs = [{ label: cat.name, href: `/category/${cat.slug}` }, { label: `${t.name} Review`, href: `/tools/${t.slug}` }];
  const a = t.article;
  const faqs = a && a.faqs.length ? a.faqs : [
    [`Is ${t.name} free?`, t.freePlan ? `Yes. ${t.name} has a free plan, and paid plans start from ${t.startingPrice}.` : `${t.name} does not have a permanent free plan${t.pricingModel === 'Free Trial' ? ', but it offers a free trial' : ''}. Paid plans start from ${t.startingPrice}.`],
    [`Who is ${t.name} best for?`, t.bestFor],
    [`What are the best ${t.name} alternatives?`, `The closest alternatives are ${alts.map((a) => a.name).join(', ')}. See the comparison section on this page for details.`],
    [`How does ToolKenzon score ${t.name}?`, `${t.name} scores ${t.score.toFixed(1)}/10 overall in our editorial review, based on ease of use (${t.scores.ease}), features (${t.scores.features}), value for money (${t.scores.value}) and support (${t.scores.support}).`]
  ];
  const body = html`
<section class="page-hero review-hero">
  <div class="container">
    ${breadcrumbs(crumbs)}
    <div class="rv-head">
      ${logoTile(t, 'xl')}
      <div class="rv-title">
        <span class="eyebrow">${sub.name} · ${t.vendor}</span>
        <h1>${t.name} Review</h1>
        <p class="lead">${t.tagline}</p>
        <div class="rv-tags">${pricingTag(t)}${t.freePlan ? html`<span class="tag tag-green">${icon('check', '', 14)} Free plan</span>` : ''}${t.editorsPick ? html`<span class="badge-pick">${icon('trophy', '', 14)} Editor's pick</span>` : ''}</div>
      </div>
      <div class="rv-score">
        ${scoreRing(t.score)}
        <span class="small muted">ToolKenzon score</span>
      </div>
    </div>
  </div>
</section>

<div class="container rv-layout">
  <article class="rv-main prose-wrap">
    <section class="verdict-box" aria-labelledby="verdict">
      <h2 id="verdict">${icon('trophy', '', 20)} Our verdict</h2>
      <p>${t.description}</p>
      <p><strong>Best for:</strong> ${t.bestFor}</p>
    </section>

    <section aria-labelledby="scores">
      <h2 id="scores">Score breakdown</h2>
      ${scoreBars(t)}
    </section>

    <section class="pc-grid" aria-label="Pros and cons">
      <div class="pc pros"><h2>${icon('check', '', 20)} Pros</h2><ul>${t.pros.map((p) => html`<li>${icon('check', 'ic-pro', 16)}<span>${p}</span></li>`)}</ul></div>
      <div class="pc cons"><h2>${icon('x', '', 20)} Cons</h2><ul>${t.cons.map((p) => html`<li>${icon('x', 'ic-con', 16)}<span>${p}</span></li>`)}</ul></div>
    </section>

    ${articleBlock(a, `Our full ${t.name} review`)}

    <section aria-labelledby="features">
      <h2 id="features">Key features</h2>
      <ul class="feature-grid">${t.features.map((f) => html`<li>${icon('check', '', 16)} ${f}</li>`)}</ul>
    </section>

    <section aria-labelledby="pricing">
      <h2 id="pricing">${t.name} pricing</h2>
      <div class="price-box">
        <div><span class="muted small">Starting price</span><b class="price-big">${t.startingPrice}</b></div>
        <div><span class="muted small">Free plan</span><b>${t.freePlan ? 'Yes' : 'No'}</b></div>
        <div><span class="muted small">Model</span><b>${t.pricingModel}</b></div>
        ${visitBtn(t, 'btn btn-accent', 'See current pricing')}
      </div>
      <p class="small muted">${t.pricingChecked ? `Pricing last checked ${formatDate(t.pricingChecked + '-01').replace(/\s\d+,/, '')}.` : 'We could not confirm this price on the vendor\'s page at our last check.'} Vendors change prices often — always confirm on the official site.</p>
    </section>

    ${comps.length ? html`<section aria-labelledby="vs"><h2 id="vs">${t.name} comparisons</h2><div class="compare-grid compact">${comps.map(compareCard)}</div></section>` : ''}

    <section aria-labelledby="alts">
      <h2 id="alts">${t.name} alternatives</h2>
      <div class="tool-grid tool-grid-2">${alts.map(toolCard)}</div>
    </section>

    <section aria-labelledby="faq">
      <h2 id="faq">FAQ</h2>
      <div class="faq">${faqs.map(([q, a]) => html`<details><summary>${q}${icon('chevronDown', 'chev', 18)}</summary><p>${a}</p></details>`)}</div>
    </section>
  </article>

  <aside class="rv-side">
    <div class="side-card sticky">
      <div class="side-top">${logoTile(t)}<div><b>${t.name}</b><span class="small muted">${sub.name}</span></div>${scorePill(t.score)}</div>
      <dl class="facts">
        <div><dt>Starting price</dt><dd>${t.startingPrice}</dd></div>
        <div><dt>Free plan</dt><dd>${t.freePlan ? 'Yes' : 'No'}</dd></div>
        <div><dt>Pricing model</dt><dd>${t.pricingModel}</dd></div>
        <div><dt>Category</dt><dd><a href="/category/${cat.slug}">${cat.name}</a></dd></div>
      </dl>
      ${visitBtn(t, 'btn btn-accent btn-block', `Visit ${t.name}`)}
      <a class="btn btn-ghost btn-block" href="${comps[0] ? '/compare/' + comps[0].slug : '/compare'}">${icon('scale', '', 16)} Compare</a>
    </div>
  </aside>
</div>

<div class="mobile-cta" aria-hidden="false">
  <div>${logoTile(t, 'sm')}<b>${t.name}</b>${scorePill(t.score)}</div>
  ${visitBtn(t, 'btn btn-accent btn-sm', 'Visit')}
</div>
${newsletter('tool')}`;

  return page({
    title: (a && a.title) || `${t.name} Review (${site.year}): Pricing, Pros & Cons`,
    description: (a && a.description) || `${t.name} review: ${t.tagline} Score ${t.score.toFixed(1)}/10. Pricing from ${t.startingPrice}, pros, cons and the best alternatives.`,
    path: `/tools/${t.slug}`, body, ogType: 'article',
    jsonLd: [
      breadcrumbLd(site, crumbs),
      {
        '@context': 'https://schema.org', '@type': 'Review',
        itemReviewed: { '@type': 'SoftwareApplication', name: t.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: t.website },
        reviewRating: { '@type': 'Rating', ratingValue: t.score, bestRating: 10, worstRating: 0 },
        author: { '@type': 'Organization', name: site.name },
        publisher: { '@type': 'Organization', name: site.name },
        ...(a ? { dateModified: a.updated } : {})
      },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  });
}

// ───────────────────────────── COMPARE ─────────────────────────────
function compareIndex() {
  const body = html`
<section class="page-hero">
  <div class="container">
    ${breadcrumbs([{ label: 'Compare', href: '/compare' }])}
    <h1>Software Comparisons</h1>
    <p class="lead">Side-by-side breakdowns of the tools people most often decide between.</p>
    <form class="compare-builder" data-compare-builder>
      <label><span class="f-label">Tool A</span><select name="a" required>${C.tools.map((t) => html`<option value="${t.slug}">${t.name}</option>`)}</select></label>
      <span class="vs">VS</span>
      <label><span class="f-label">Tool B</span><select name="b" required>${C.tools.map((t, i) => html`<option value="${t.slug}"${i === 1 ? raw(' selected') : ''}>${t.name}</option>`)}</select></label>
      <button class="btn btn-primary" type="submit">Compare</button>
      <p class="form-msg small" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
<section class="section-tight"><div class="container">
  ${C.categories.map((cat) => {
    const list = C.comparisons.filter((c) => c.toolA.category === cat.slug);
    return list.length ? html`<h2 class="h-sub">${cat.name}</h2><div class="compare-grid">${list.map(compareCard)}</div>` : '';
  })}
</div></section>
${newsletter('cmp')}`;
  return page({ title: 'Software Comparisons: AI, SaaS & Email Tools Side by Side', description: 'Head-to-head comparisons of popular AI tools, SaaS platforms and email marketing software — features, pricing and our verdict.', path: '/compare', body });
}

function compare(c) {
  const A = c.toolA; const B = c.toolB;
  const allFeatures = [...new Set([...A.features, ...B.features])];
  const winner = (x, y) => (x > y ? 'a' : y > x ? 'b' : '');
  const row = (label, va, vb, w = '') => html`<tr><th scope="row">${label}</th><td class="${w === 'a' ? 'win' : ''}">${va}${w === 'a' ? html` <span class="win-tag">${icon('check', '', 12)}<span class="sr-only">winner</span></span>` : ''}</td><td class="${w === 'b' ? 'win' : ''}">${vb}${w === 'b' ? html` <span class="win-tag">${icon('check', '', 12)}<span class="sr-only">winner</span></span>` : ''}</td></tr>`;
  const yes = html`<span class="yes">${icon('check', '', 16)}<span class="sr-only">Yes</span></span>`;
  const no = html`<span class="no">${icon('x', '', 16)}<span class="sr-only">No</span></span>`;
  const crumbs = [{ label: 'Compare', href: '/compare' }, { label: `${A.name} vs ${B.name}`, href: `/compare/${c.slug}` }];
  const overall = winner(A.score, B.score);
  const body = html`
<section class="page-hero compare-hero">
  <div class="container">
    ${breadcrumbs(crumbs)}
    <h1>${A.name} vs ${B.name}</h1>
    <p class="lead">${c.summary} Here's how they compare on features, pricing and value in ${site.year}.</p>
    <div class="vs-board">
      ${[A, B].map((t, i) => html`<div class="vs-side${(overall === 'a' && i === 0) || (overall === 'b' && i === 1) ? ' is-winner' : ''}">
        ${(overall === 'a' && i === 0) || (overall === 'b' && i === 1) ? html`<span class="badge-pick">${icon('trophy', '', 14)} Higher score</span>` : ''}
        ${logoTile(t, 'lg')}
        <h2><a href="/tools/${t.slug}">${t.name}</a></h2>
        ${scoreRing(t.score, 76)}
        <p class="small muted">From ${t.startingPrice}</p>
        ${visitBtn(t, 'btn btn-accent btn-sm', `Try ${t.name}`)}
      </div>`)}
      <span class="vs-mid" aria-hidden="true">VS</span>
    </div>
  </div>
</section>

<div class="container narrow">
  <section class="verdict-box" aria-labelledby="qv">
    <h2 id="qv">${icon('trophy', '', 20)} Quick verdict</h2>
    <p>${c.verdict}</p>
    <div class="choose-grid">
      <div><h3>Choose ${A.name} if…</h3><p>${c.pickA}</p></div>
      <div><h3>Choose ${B.name} if…</h3><p>${c.pickB}</p></div>
    </div>
  </section>

  <section aria-labelledby="tbl">
    <h2 id="tbl">Side-by-side comparison</h2>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Comparison table">
      <table class="cmp-table">
        <thead><tr><th scope="col"><span class="sr-only">Criteria</span></th><th scope="col">${A.name}</th><th scope="col">${B.name}</th></tr></thead>
        <tbody>
          ${row('ToolKenzon score', `${A.score.toFixed(1)}/10`, `${B.score.toFixed(1)}/10`, overall)}
          ${row('Ease of use', A.scores.ease.toFixed(1), B.scores.ease.toFixed(1), winner(A.scores.ease, B.scores.ease))}
          ${row('Features', A.scores.features.toFixed(1), B.scores.features.toFixed(1), winner(A.scores.features, B.scores.features))}
          ${row('Value for money', A.scores.value.toFixed(1), B.scores.value.toFixed(1), winner(A.scores.value, B.scores.value))}
          ${row('Support', A.scores.support.toFixed(1), B.scores.support.toFixed(1), winner(A.scores.support, B.scores.support))}
          ${row('Starting price', A.startingPrice, B.startingPrice)}
          ${row('Free plan', A.freePlan ? yes : no, B.freePlan ? yes : no)}
          ${row('Pricing model', A.pricingModel, B.pricingModel)}
          ${row('Best for', A.bestFor, B.bestFor)}
        </tbody>
        <tbody class="tbody-features">
          <tr><th scope="colgroup" colspan="3" class="tbl-group">Features</th></tr>
          ${allFeatures.map((f) => row(f, A.features.includes(f) ? yes : html`<span class="muted">—</span>`, B.features.includes(f) ? yes : html`<span class="muted">—</span>`))}
        </tbody>
      </table>
    </div>
    <p class="small muted">Feature list reflects headline features named by each vendor; "—" means not listed as a headline feature, not necessarily missing.</p>
  </section>

  ${articleBlock(c.article, `${A.name} vs ${B.name}: the full comparison`)}

  ${[A, B].map((t) => html`<section aria-labelledby="pc-${t.slug}">
    <h2 id="pc-${t.slug}">${t.name}: pros & cons</h2>
    <div class="pc-grid">
      <div class="pc pros"><h3>${icon('check', '', 18)} Pros</h3><ul>${t.pros.map((p) => html`<li>${icon('check', 'ic-pro', 16)}<span>${p}</span></li>`)}</ul></div>
      <div class="pc cons"><h3>${icon('x', '', 18)} Cons</h3><ul>${t.cons.map((p) => html`<li>${icon('x', 'ic-con', 16)}<span>${p}</span></li>`)}</ul></div>
    </div>
    <p><a class="link-arrow" href="/tools/${t.slug}">Read the full ${t.name} review ${icon('arrowRight', '', 16)}</a></p>
  </section>`)}

  <section class="cta-split">
    ${[A, B].map((t) => html`<div class="cta-card">${logoTile(t)}<div><b>${t.name}</b><span class="small muted">From ${t.startingPrice}</span></div>${visitBtn(t, 'btn btn-accent btn-sm', 'Visit')}</div>`)}
  </section>

  <section>
    <h2>Other comparisons</h2>
    <div class="compare-grid compact">${C.comparisons.filter((x) => x !== c && (x.toolA.category === A.category)).slice(0, 4).map(compareCard)}</div>
  </section>
</div>
${newsletter('cmp')}`;
  return page({
    title: (c.article && c.article.title) || `${A.name} vs ${B.name} (${site.year}): Which Is Better?`,
    description: (c.article && c.article.description) || `${A.name} vs ${B.name}: features, pricing, pros and cons compared side by side. ${c.verdict.split('. ')[0]}.`,
    path: `/compare/${c.slug}`, body, ogType: 'article',
    jsonLd: [breadcrumbLd(site, crumbs)]
  });
}

// ───────────────────────────── BEST OF ─────────────────────────────
function bestIndex() {
  const body = html`
<section class="page-hero"><div class="container">
  ${breadcrumbs([{ label: 'Best Of', href: '/best' }])}
  <h1>Best-of Buying Guides</h1>
  <p class="lead">Ranked shortlists for the decisions that matter, updated as tools change.</p>
</div></section>
<section class="section-tight"><div class="container"><div class="best-grid">${C.bestof.map(bestCard)}</div></div></section>
${newsletter('best')}`;
  return page({ title: 'Best AI, SaaS & Email Marketing Tools — Buying Guides', path: '/best', body });
}

function best(b) {
  const cat = C.catMap[b.category];
  const picks = b.picks.map(([s, label]) => ({ t: C.toolMap[s], label }));
  const crumbs = [{ label: 'Best Of', href: '/best' }, { label: b.title, href: `/best/${b.slug}` }];
  const body = html`
<section class="page-hero" style="--cat:${cat.color}"><div class="container">
  ${breadcrumbs(crumbs)}
  <span class="eyebrow">${cat.name} · Updated ${formatDate(latestPricingCheck + '-01').replace(/\s\d+,/, '')}</span>
  <h1>${b.title} in ${site.year}</h1>
  <p class="lead">${b.intro}</p>
</div></section>

<div class="container narrow">
  <section class="quicklist" aria-labelledby="ql">
    <h2 id="ql">Our top picks at a glance</h2>
    <ol>${picks.map(({ t, label }, i) => html`<li><span class="rank">${i + 1}</span>${logoTile(t, 'sm')}<a href="#pick-${t.slug}"><b>${t.name}</b></a><span class="ql-label">${label}</span>${scorePill(t.score)}${visitBtn(t, 'btn btn-outline btn-sm hide-sm', 'Visit')}</li>`)}</ol>
  </section>

  ${picks.map(({ t, label }, i) => html`<section class="pick" id="pick-${t.slug}" aria-labelledby="h-${t.slug}">
    <div class="pick-head">
      <span class="rank lg">${i + 1}</span>
      ${logoTile(t, 'lg')}
      <div><span class="pick-label">${label}</span><h2 id="h-${t.slug}">${t.name}</h2><p class="muted">${t.tagline}</p></div>
      ${scoreRing(t.score, 72)}
    </div>
    <p>${t.description}</p>
    <div class="pc-grid">
      <div class="pc pros"><h3>${icon('check', '', 18)} Pros</h3><ul>${t.pros.map((p) => html`<li>${icon('check', 'ic-pro', 16)}<span>${p}</span></li>`)}</ul></div>
      <div class="pc cons"><h3>${icon('x', '', 18)} Cons</h3><ul>${t.cons.map((p) => html`<li>${icon('x', 'ic-con', 16)}<span>${p}</span></li>`)}</ul></div>
    </div>
    <div class="pick-foot">
      <span><span class="muted small">Starting price</span> <b>${t.startingPrice}</b></span>
      <span><span class="muted small">Free plan</span> <b>${t.freePlan ? 'Yes' : 'No'}</b></span>
      <a class="btn btn-ghost btn-sm" href="/tools/${t.slug}">Full review</a>
      ${visitBtn(t, 'btn btn-accent btn-sm', `Visit ${t.name}`)}
    </div>
  </section>`)}

  <section class="method-box" aria-labelledby="hw">
    <h2 id="hw">How we chose</h2>
    <ul>${b.howWeChose.map((x) => html`<li>${icon('check', '', 16)} ${x}</li>`)}</ul>
    <p class="small">Read our full <a href="/about">review methodology</a>.</p>
  </section>
</div>
${newsletter('best')}`;
  return page({
    title: `${b.title} (${site.year}) — Compared & Ranked`,
    description: `${b.intro.split('. ')[0]}. Top picks: ${picks.slice(0, 3).map((p) => p.t.name).join(', ')}.`,
    path: `/best/${b.slug}`, body, ogType: 'article',
    jsonLd: [breadcrumbLd(site, crumbs), { '@context': 'https://schema.org', '@type': 'ItemList', name: b.title, itemListElement: picks.map(({ t }, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/tools/${t.slug}`, name: t.name })) }]
  });
}

// ───────────────────────────── BLOG ─────────────────────────────
function blogIndex() {
  const [first, ...rest] = C.posts;
  const body = html`
<section class="page-hero"><div class="container">
  ${breadcrumbs([{ label: 'Guides', href: '/blog' }])}
  <h1>Guides & Insights</h1>
  <p class="lead">Practical how-tos for choosing and using AI, SaaS and email marketing tools.</p>
</div></section>
<section class="section-tight"><div class="container">
  <article class="post-feature">
    <a href="/blog/${first.slug}" class="post-cover lg" style="--cat:${C.catMap[first.category].color}" tabindex="-1" aria-hidden="true">${icon(first.cover, '', 64)}</a>
    <div>
      <span class="eyebrow">Featured · ${C.catMap[first.category].name}</span>
      <h2><a href="/blog/${first.slug}">${first.title}</a></h2>
      <p class="lead-sm">${first.description}</p>
      <p class="post-meta">${icon('clock', '', 14)} ${first.readTime} min read · <time datetime="${first.date}">${formatDate(first.date)}</time></p>
    </div>
  </article>
  <div class="post-grid">${rest.map(postCard)}</div>
</div></section>
${newsletter('blog')}`;
  return page({ title: 'Guides: AI Tools, SaaS & Email Marketing', description: 'Practical guides on choosing and using AI tools, SaaS platforms and email marketing software.', path: '/blog', body });
}

function post(p) {
  const cat = C.catMap[p.category];
  const crumbs = [{ label: 'Guides', href: '/blog' }, { label: p.title, href: `/blog/${p.slug}` }];
  const tools = p.tools.map((s) => C.toolMap[s]);
  const related = C.posts.filter((x) => x !== p).slice(0, 3);
  const body = html`
<section class="page-hero post-hero" style="--cat:${cat.color}"><div class="container narrow">
  ${breadcrumbs(crumbs)}
  <span class="eyebrow">${cat.name}</span>
  <h1>${p.title}</h1>
  <p class="lead">${p.description}</p>
  <p class="post-meta">By ${p.author} · ${icon('clock', '', 14)} ${p.readTime} min read · <time datetime="${p.date}">${formatDate(p.date)}</time></p>
</div></section>
<div class="container post-layout">
  <aside class="toc" aria-label="On this page">
    <div class="sticky">
      <p class="f-label">On this page</p>
      <ol>${p.toc.map((h) => html`<li><a href="#${h.id}">${raw(h.text.replace(/\*\*/g, ''))}</a></li>`)}</ol>
    </div>
  </aside>
  <article class="prose">
    ${raw(p.html)}
  </article>
  <aside class="post-tools" aria-label="Tools mentioned">
    <div class="sticky">
      <p class="f-label">Tools in this guide</p>
      <ul class="mini-tools">${tools.map((t) => html`<li>${logoTile(t, 'sm')}<a href="/tools/${t.slug}">${t.name}</a>${scorePill(t.score)}</li>`)}</ul>
    </div>
  </aside>
</div>
<section class="section section-alt"><div class="container">${sectionHead('Keep reading', 'Related guides', '/blog', 'All guides')}<div class="post-grid">${related.map(postCard)}</div></div></section>
${newsletter('post')}`;
  return page({
    title: p.title, description: p.description, path: `/blog/${p.slug}`, body, ogType: 'article',
    jsonLd: [breadcrumbLd(site, crumbs), { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, author: { '@type': 'Organization', name: p.author }, publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.url + '/img/logo.svg' } }, mainEntityOfPage: `${site.url}/blog/${p.slug}` }]
  });
}

// ───────────────────────────── STATIC PAGES ─────────────────────────────
function simple({ path, title, description, h1, lead, content }) {
  const body = html`
<section class="page-hero"><div class="container narrow">
  ${breadcrumbs([{ label: h1, href: path }])}
  <h1>${h1}</h1>${lead ? html`<p class="lead">${lead}</p>` : ''}
</div></section>
<div class="container narrow"><article class="prose">${raw(content)}</article></div>`;
  return page({ title, description, path, body });
}

const about = () => simple({
  path: '/about', title: 'About ToolKenzon & Our Review Methodology', h1: 'About ToolKenzon',
  description: 'Who we are, how we review software and how we keep our reviews independent.',
  lead: 'We help marketers, founders and teams choose software with confidence.',
  content: `
<h2 id="mission">Our mission</h2>
<p>Software buying is noisy. Vendor pages promise everything, and many "review" sites rank whoever pays the most. ToolKenzon exists to give you clear, honest guidance so you can pick the right AI, SaaS or email marketing tool quickly.</p>
<h2 id="method">How we review</h2>
<ol>
<li><strong>Research-based reviews.</strong> We read pricing pages, documentation and public user reviews. We say so on the page when a review draws on our own use of a tool, and we don't claim testing we haven't done.</li>
<li><strong>Consistent scoring.</strong> Every tool gets an editorial score out of 10 based on four criteria: <em>ease of use</em>, <em>features</em>, <em>value for money</em> and <em>support</em>.</li>
<li><strong>Real pricing.</strong> We report the entry price and flag where costs rise as you grow. Each page shows when pricing was last checked.</li>
<li><strong>Updates.</strong> Tools change fast, so we update listings and scores when we learn of meaningful changes.</li>
</ol>
<h2 id="independence">Editorial independence</h2>
<p>Some links on ToolKenzon are affiliate links. That never affects scores or rankings: tools without affiliate programs are reviewed and ranked on exactly the same criteria. See our <a href="/affiliate-disclosure">affiliate disclosure</a>.</p>
<h2 id="contact">Get in touch</h2>
<p>Spotted an outdated price or a tool we should review? <a href="/contact">Contact us</a> — we read every message.</p>`
});

const disclosure = () => simple({
  path: '/affiliate-disclosure', title: 'Affiliate Disclosure', h1: 'Affiliate Disclosure',
  description: 'How ToolKenzon makes money and how we keep our reviews independent.',
  content: `
<p>ToolKenzon is reader-supported. When you click some links on our site and make a purchase, we may earn an affiliate commission. This comes at <strong>no extra cost to you</strong>.</p>
<h2 id="how">How it works</h2>
<p>Outbound "Visit" buttons may contain tracking links provided by software vendors or affiliate networks. These links are marked with <code>rel="sponsored"</code>.</p>
<h2 id="independence">Our promise</h2>
<ul>
<li>Vendors cannot pay for a higher score or ranking.</li>
<li>We include tools whether or not they have an affiliate program.</li>
<li>We clearly label sponsored placements if we ever offer them.</li>
</ul>
<p>Questions? Email <a href="mailto:${site.email}">${site.email}</a>.</p>`
});

const privacy = () => simple({
  path: '/privacy', title: 'Privacy Policy', h1: 'Privacy Policy',
  description: 'How ToolKenzon collects and uses information.',
  content: `
<p><em>Last updated: ${formatDate(new Date().toISOString().slice(0, 10))}</em></p>
<p>This policy explains what information ToolKenzon.com ("we") collects and how we use it. <strong>Please review this template with a qualified advisor before publishing.</strong></p>
<h2 id="collect">Information we collect</h2>
<ul>
<li><strong>Newsletter and contact forms:</strong> the email address and message you submit.</li>
<li><strong>Analytics:</strong> if enabled, anonymised usage data such as pages visited, collected via cookies.</li>
<li><strong>Affiliate links:</strong> partners may set cookies to attribute purchases made after clicking our links.</li>
</ul>
<h2 id="use">How we use it</h2>
<p>To send the newsletter you requested, reply to your messages and improve our content. We do not sell your personal information.</p>
<h2 id="rights">Your choices</h2>
<p>You can unsubscribe from emails at any time and request deletion of your data by contacting <a href="mailto:${site.email}">${site.email}</a>.</p>`
});

const terms = () => simple({
  path: '/terms', title: 'Terms of Use', h1: 'Terms of Use',
  description: 'Terms for using ToolKenzon.com.',
  content: `
<p>By using ToolKenzon.com you agree to these terms. <strong>Please review this template with a qualified advisor before publishing.</strong></p>
<h2 id="info">Information only</h2>
<p>Our reviews and comparisons reflect our editorial opinion at the time of writing. Features and prices change; always confirm details on the vendor's website before buying.</p>
<h2 id="trademarks">Trademarks</h2>
<p>Product names and trademarks belong to their respective owners. Their use here is for identification only and does not imply endorsement.</p>
<h2 id="liability">Liability</h2>
<p>ToolKenzon is provided "as is" without warranties. We are not liable for decisions made based on our content.</p>`
});

function contact() {
  const body = html`
<section class="page-hero"><div class="container narrow">
  ${breadcrumbs([{ label: 'Contact', href: '/contact' }])}
  <h1>Contact us</h1>
  <p class="lead">Suggest a tool, report an outdated price or ask about partnerships.</p>
</div></section>
<div class="container narrow">
  <form class="contact-form" action="/api/contact" method="post" data-ajax novalidate>
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"><p class="help">We'll only use this to reply.</p></div>
    <div class="field"><label for="c-topic">Topic</label><select id="c-topic" name="topic"><option>Suggest a tool</option><option>Report outdated info</option><option>Partnership</option><option>Other</option></select></div>
    <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="6" required></textarea></div>
    <button class="btn btn-primary" type="submit">Send message</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>
  <p class="muted small">Prefer email? Write to <a href="mailto:${site.email}">${site.email}</a>.</p>
</div>`;
  return page({ title: 'Contact', description: 'Contact the ToolKenzon team.', path: '/contact', body });
}

function notFound() {
  const body = html`<section class="page-hero center"><div class="container narrow">
    <span class="big-404" aria-hidden="true">404</span>
    <h1>We couldn't find that page</h1>
    <p class="lead">It may have moved. Try searching the directory instead.</p>
    <form class="hero-search" action="/tools" method="get" role="search"><label for="nf-q" class="sr-only">Search tools</label>${icon('search', 'hs-icon', 22)}<input id="nf-q" name="q" type="search" placeholder="Search tools…"><button class="btn btn-primary">Search</button></form>
    <p><a class="link-arrow" href="/">Back to homepage ${icon('arrowRight', '', 16)}</a></p>
  </div></section>`;
  return page({ title: 'Page not found', path: '/404', body, noindex: true });
}

function goPage(t) {
  const url = t.affiliateUrl || t.website;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=${url}"><title>Redirecting to ${t.name}…</title><script>location.replace(${JSON.stringify(url)})</script></head><body><p>Redirecting to <a href="${url}" rel="sponsored nofollow">${t.name}</a>…</p></body></html>`;
}

module.exports = { home, directory, category, tool, compareIndex, compare, bestIndex, best, blogIndex, post, about, disclosure, privacy, terms, contact, notFound, goPage };
