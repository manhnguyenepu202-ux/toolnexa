/* ToolKenzon client script — progressive enhancement only; every page works without JS. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ── Theme toggle ──
  var root = document.documentElement;
  var themeBtn = $('.theme-toggle');
  if (themeBtn) {
    var sync = function () { themeBtn.setAttribute('aria-pressed', root.dataset.theme === 'dark' ? 'true' : 'false'); };
    sync();
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('tn-theme', next); } catch (e) { /* storage unavailable */ }
      sync();
    });
  }

  // ── Mobile nav ──
  var navBtn = $('.nav-toggle');
  var mnav = $('#mobile-nav');
  if (navBtn && mnav) {
    navBtn.addEventListener('click', function () {
      var open = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!open));
      navBtn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mnav.hidden = open;
      if (!open) { var i = $('input', mnav); if (i) i.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mnav.hidden) { mnav.hidden = true; navBtn.setAttribute('aria-expanded', 'false'); navBtn.focus(); }
    });
  }

  // ── Home: trending tabs ──
  var tabs = $$('.tabs [role="tab"]');
  var tabItems = $$('[data-tabgrid] .tab-item');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.dataset.tab;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      var shown = 0;
      tabItems.forEach(function (it) {
        var ok = key === 'all' ? it.dataset.trending === '1' : (it.dataset.cat === key && shown < 9);
        it.hidden = !ok;
        if (ok) shown++;
      });
    });
  });

  // ── Category: sub-category chips ──
  var subWrap = $('[data-subfilter]');
  if (subWrap) {
    var cards = $$('[data-subgrid] .tool-card');
    var applySub = function (sub) {
      $$('.chip', subWrap).forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.sub === sub)); });
      cards.forEach(function (c) { c.hidden = !!sub && c.dataset.sub !== sub; });
    };
    subWrap.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      applySub(chip.dataset.sub);
      var u = new URL(location.href);
      if (chip.dataset.sub) u.searchParams.set('sub', chip.dataset.sub); else u.searchParams.delete('sub');
      history.replaceState(null, '', u);
    });
    var initSub = new URL(location.href).searchParams.get('sub');
    if (initSub) applySub(initSub);
  }

  // ── Directory filters ──
  var grid = $('#dir-grid');
  if (grid) {
    var all = $$('.tool-card', grid);
    var q = $('#f-q'); var sub = $('#f-sub'); var pricing = $('#f-pricing'); var free = $('#f-free');
    var sort = $('#f-sort'); var count = $('#dir-count'); var empty = $('#dir-empty');
    var params = new URL(location.href).searchParams;
    if (params.get('q')) q.value = params.get('q');
    if (params.get('cat')) { var r = $('input[name="f-cat"][value="' + params.get('cat') + '"]'); if (r) r.checked = true; }

    var apply = function () {
      var term = q.value.trim().toLowerCase();
      var cat = ($('input[name="f-cat"]:checked') || {}).value || '';
      $$('option[data-parent]', sub).forEach(function (o) { o.hidden = !!cat && o.dataset.parent !== cat; });
      if (cat && sub.value && sub.selectedOptions[0].dataset.parent !== cat) sub.value = '';
      var n = 0;
      all.forEach(function (c) {
        var ok = (!term || c.dataset.search.indexOf(term) !== -1) &&
          (!cat || c.dataset.cat === cat) &&
          (!sub.value || c.dataset.sub === sub.value) &&
          (!pricing.value || c.dataset.pricing === pricing.value) &&
          (!free.checked || c.dataset.free === '1');
        c.hidden = !ok; if (ok) n++;
      });
      var key = sort.value;
      all.slice().sort(function (a, b) {
        if (key === 'name') return a.dataset.name.localeCompare(b.dataset.name);
        if (key === 'price') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        return parseFloat(b.dataset.score) - parseFloat(a.dataset.score);
      }).forEach(function (c) { grid.appendChild(c); });
      count.textContent = 'Showing ' + n + ' tool' + (n === 1 ? '' : 's');
      empty.hidden = n !== 0;
      var u = new URL(location.href);
      term ? u.searchParams.set('q', term) : u.searchParams.delete('q');
      cat ? u.searchParams.set('cat', cat) : u.searchParams.delete('cat');
      history.replaceState(null, '', u);
    };
    var t;
    q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(apply, 120); });
    [sub, pricing, free, sort].forEach(function (el) { el.addEventListener('change', apply); });
    $$('input[name="f-cat"]').forEach(function (el) { el.addEventListener('change', apply); });
    $('#f-reset').addEventListener('click', function () {
      q.value = ''; sub.value = ''; pricing.value = ''; free.checked = false; sort.value = 'score';
      $('input[name="f-cat"][value=""]').checked = true; apply(); q.focus();
    });
    apply();
  }

  // ── Compare builder ──
  var cb = $('[data-compare-builder]');
  if (cb) {
    var known = $$('.compare-card').map(function (a) { return a.getAttribute('href'); });
    cb.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = cb.a.value; var b = cb.b.value; var msg = $('.form-msg', cb);
      if (a === b) { msg.textContent = 'Pick two different tools to compare.'; return; }
      var p1 = '/compare/' + a + '-vs-' + b; var p2 = '/compare/' + b + '-vs-' + a;
      if (known.indexOf(p1) !== -1) location.href = p1;
      else if (known.indexOf(p2) !== -1) location.href = p2;
      else { msg.textContent = 'We haven\'t published that comparison yet — opening both reviews instead.'; setTimeout(function () { location.href = '/tools/' + a; }, 1200); }
    });
  }

  // ── AJAX forms (newsletter, contact) ──
  $$('form[data-ajax]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', form);
      var btn = $('button[type="submit"]', form);
      var email = form.email;
      msg.className = 'form-msg';
      $$('.field-error', form).forEach(function (el) { el.classList.remove('field-error'); el.removeAttribute('aria-invalid'); });
      var invalid = $$('[required]', form).filter(function (el) { return !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())); });
      if (invalid.length) {
        invalid.forEach(function (el) { el.classList.add('field-error'); el.setAttribute('aria-invalid', 'true'); });
        msg.textContent = invalid[0] === email ? 'Please enter a valid email address.' : 'Please fill in the highlighted fields.';
        msg.classList.add('err'); invalid[0].focus(); return;
      }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          msg.textContent = res.ok ? res.j.message : (res.j.error || 'Something went wrong. Please try again.');
          msg.classList.add(res.ok ? 'ok' : 'err');
          if (res.ok) form.reset();
        })
        .catch(function () { msg.textContent = 'Could not send right now. Please email us instead.'; msg.classList.add('err'); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  // ── Blog TOC active state ──
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.prose h2[id]').forEach(function (h) { io.observe(h); });
  }

  // ── Subtle reveal on scroll ──
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var els = $$('.section .tool-card, .cat-card, .compare-card, .best-card, .post-card, .how-steps li');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal'); ro.observe(el); }
    });
  }

  // ── Outbound click tracking hook (GA4 if configured) ──
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track="visit"]');
    if (a && typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', { tool: a.dataset.tool });
  });
})();
