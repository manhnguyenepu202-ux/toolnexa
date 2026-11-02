// Tiny, dependency-free Markdown → HTML converter covering what the blog uses:
// headings, paragraphs, ordered/unordered lists, blockquotes, code, bold, italic, links.
const { esc } = require('./util');

function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, href) => {
    const external = /^https?:\/\//.test(href);
    return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  });
  return out;
}

function slugify(s) {
  return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { data, body: src.slice(m[0].length) };
}

function render(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const html = [];
  const toc = [];
  let para = [];
  let list = null; // { type, items }

  const flushPara = () => {
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) html.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.type}>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) { flushPara(); flushList(); continue; }
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      flushPara(); flushList();
      const level = m[1].length;
      const id = slugify(m[2]);
      if (level === 2) toc.push({ id, text: m[2] });
      html.push(`<h${level} id="${id}">${inline(m[2])}</h${level}>`);
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); html.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`); continue; }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(m[1]); continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(m[1]); continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara(); flushList();
  return { html: html.join('\n'), toc };
}

module.exports = { render, parseFrontmatter, slugify };
